  //@@slot top-note
  var HQ_LIB = (function () {
    const GTAOShader = {

      name: 'GTAOShader',

      defines: {
        PERSPECTIVE_CAMERA: 1,
        SAMPLES: 16,
        NORMAL_VECTOR_TYPE: 1,
        SCREEN_SPACE_RADIUS: 0,
        SCREEN_SPACE_RADIUS_SCALE: 100.0,
        SCENE_CLIP_BOX: 0,
      },

      uniforms: {
        tNormal: { value: null },
        tDepth: { value: null },
        tNoise: { value: null },
        resolution: { value: new Vector2() },
        cameraNear: { value: null },
        cameraFar: { value: null },
        cameraProjectionMatrix: { value: new Matrix4() },
        cameraProjectionMatrixInverse: { value: new Matrix4() },
        cameraWorldMatrix: { value: new Matrix4() },
        radius: { value: 0.25 },
        distanceExponent: { value: 1. },
        thickness: { value: 1. },
        distanceFallOff: { value: 1. },
        scale: { value: 1. },
        sceneBoxMin: { value: new Vector3( - 1, - 1, - 1 ) },
        sceneBoxMax: { value: new Vector3( 1, 1, 1 ) },
      },

      vertexShader: /* glsl */`

        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,

      fragmentShader: /* glsl */`
        varying vec2 vUv;
        uniform highp sampler2D tNormal;
        uniform highp sampler2D tDepth;
        uniform sampler2D tNoise;
        uniform vec2 resolution;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform mat4 cameraProjectionMatrix;
        uniform mat4 cameraProjectionMatrixInverse;
        uniform mat4 cameraWorldMatrix;
        uniform float radius;
        uniform float distanceExponent;
        uniform float thickness;
        uniform float distanceFallOff;
        uniform float scale;
        #if SCENE_CLIP_BOX == 1
          uniform vec3 sceneBoxMin;
          uniform vec3 sceneBoxMax;
        #endif

        #include <common>
        #include <packing>

        #ifndef FRAGMENT_OUTPUT
        #define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
        #endif

        vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
          #ifdef USE_REVERSED_DEPTH_BUFFER
            vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
          #else
            vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
          #endif
          vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
          return viewSpacePosition.xyz / viewSpacePosition.w;
        }

        float getDepth(const vec2 uv) {
          return textureLod(tDepth, uv.xy, 0.0).r;
        }

        float fetchDepth(const ivec2 uv) {
          return texelFetch(tDepth, uv.xy, 0).r;
        }

        float getViewZ(const in float depth) {
          #if PERSPECTIVE_CAMERA == 1
            return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
          #else
            return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
          #endif
        }

        vec3 computeNormalFromDepth(const vec2 uv) {
          vec2 size = vec2(textureSize(tDepth, 0));
          ivec2 p = ivec2(uv * size);
          float c0 = fetchDepth(p);
          float l2 = fetchDepth(p - ivec2(2, 0));
          float l1 = fetchDepth(p - ivec2(1, 0));
          float r1 = fetchDepth(p + ivec2(1, 0));
          float r2 = fetchDepth(p + ivec2(2, 0));
          float b2 = fetchDepth(p - ivec2(0, 2));
          float b1 = fetchDepth(p - ivec2(0, 1));
          float t1 = fetchDepth(p + ivec2(0, 1));
          float t2 = fetchDepth(p + ivec2(0, 2));
          float dl = abs((2.0 * l1 - l2) - c0);
          float dr = abs((2.0 * r1 - r2) - c0);
          float db = abs((2.0 * b1 - b2) - c0);
          float dt = abs((2.0 * t1 - t2) - c0);
          vec3 ce = getViewPosition(uv, c0).xyz;
          vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
          vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
          return normalize(cross(dpdx, dpdy));
        }

        vec3 getViewNormal(const vec2 uv) {
          #if NORMAL_VECTOR_TYPE == 2
            return normalize(textureLod(tNormal, uv, 0.).rgb);
          #elif NORMAL_VECTOR_TYPE == 1
            return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
          #else
            return computeNormalFromDepth(uv);
          #endif
        }

        vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
          vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
          vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
          float sampleSceneDepth = getDepth(sampleUv);
          return vec3(sampleUv, sampleSceneDepth);
        }

        void main() {
          float depth = getDepth(vUv.xy);

          #ifdef USE_REVERSED_DEPTH_BUFFER
            if (depth <= 0.0) {
              discard;
              return;
            }
          #else
            if (depth >= 1.0) {
              discard;
              return;
            }
          #endif

          vec3 viewPos = getViewPosition(vUv, depth);
          vec3 viewNormal = getViewNormal(vUv);

          float radiusToUse = radius;
          float distanceFalloffToUse = thickness;
          #if SCREEN_SPACE_RADIUS == 1
            float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
            radiusToUse *= radiusScale;
            distanceFalloffToUse *= radiusScale;
          #endif

          #if SCENE_CLIP_BOX == 1
            vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
            float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
            if (boxDistance > radiusToUse) {
              discard;
              return;
            }
          #endif

          vec2 noiseResolution = vec2(textureSize(tNoise, 0));
          vec2 noiseUv = vUv * resolution / noiseResolution;
          vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
          vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
          vec3 tangent = normalize(vec3(randomVec.xy, 0.));
          vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
          mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

          const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
          const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
          float ao = 0.0;
          for (int i = 0; i < DIRECTIONS; ++i) {

            float angle = float(i) / float(DIRECTIONS) * PI;
            vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
            sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

            #if PERSPECTIVE_CAMERA == 1
              vec3 viewDir = normalize(-viewPos.xyz);
            #else
              vec3 viewDir = vec3(0., 0., 1.);
            #endif
            vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
            vec3 sliceTangent = cross(sliceBitangent, viewDir);
            vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

            vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
            vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

            for (int j = 0; j < STEPS; ++j) {
              vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

              vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
              vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
              vec3 viewDelta = sampleSceneViewPos - viewPos;
              if (abs(viewDelta.z) < thickness) {
                float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
                cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
              }

              sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
              sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
              viewDelta = sampleSceneViewPos - viewPos;
              if (abs(viewDelta.z) < thickness) {
                float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
                cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
              }
            }

            vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
            float nx = dot(normalInSlice, sliceTangent);
            float ny = dot(normalInSlice, viewDir);
            float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
            float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
            float occlusion = nx * nxb + ny * nyb;
            ao += occlusion;
          }

          ao = clamp(ao / float(DIRECTIONS), 0., 1.);
        #if SCENE_CLIP_BOX == 1
          ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
        #endif
          ao = pow(ao, scale);

          gl_FragColor = FRAGMENT_OUTPUT;
        }`

    };

    function generateMagicSquareNoise( size = 5 ) {

      const noiseSize = Math.floor( size ) % 2 === 0 ? Math.floor( size ) + 1 : Math.floor( size );
      const magicSquare = generateMagicSquare( noiseSize );
      const noiseSquareSize = magicSquare.length;
      const data = new Uint8Array( noiseSquareSize * 4 );

      for ( let inx = 0; inx < noiseSquareSize; ++ inx ) {

        const iAng = magicSquare[ inx ];
        const angle = ( 2 * Math.PI * iAng ) / noiseSquareSize;
        const randomVec = new Vector3(
          Math.cos( angle ),
          Math.sin( angle ),
          0
        ).normalize();
        data[ inx * 4 ] = ( randomVec.x * 0.5 + 0.5 ) * 255;
        data[ inx * 4 + 1 ] = ( randomVec.y * 0.5 + 0.5 ) * 255;
        data[ inx * 4 + 2 ] = 127;
        data[ inx * 4 + 3 ] = 255;

      }

      const noiseTexture = new DataTexture( data, noiseSize, noiseSize );
      noiseTexture.wrapS = RepeatWrapping;
      noiseTexture.wrapT = RepeatWrapping;
      noiseTexture.needsUpdate = true;

      return noiseTexture;

    }

    function generateMagicSquare( size ) {

      const noiseSize = Math.floor( size ) % 2 === 0 ? Math.floor( size ) + 1 : Math.floor( size );
      const noiseSquareSize = noiseSize * noiseSize;
      const magicSquare = Array( noiseSquareSize ).fill( 0 );
      let i = Math.floor( noiseSize / 2 );
      let j = noiseSize - 1;

      for ( let num = 1; num <= noiseSquareSize; ) {

        if ( i === - 1 && j === noiseSize ) {

          j = noiseSize - 2;
          i = 0;

        } else {

          if ( j === noiseSize ) {

            j = 0;

          }

          if ( i < 0 ) {

            i = noiseSize - 1;

          }

        }

        if ( magicSquare[ i * noiseSize + j ] !== 0 ) {

          j -= 2;
          i ++;
          continue;

        } else {

          magicSquare[ i * noiseSize + j ] = num ++;

        }

        j ++;
        i --;

      }

      return magicSquare;

    }

    const PoissonDenoiseShader = {

      name: 'PoissonDenoiseShader',

      defines: {
        'SAMPLES': 16,
        'SAMPLE_VECTORS': generatePdSamplePointInitializer( 16, 2, 1 ),
        'NORMAL_VECTOR_TYPE': 1,
      },

      uniforms: {
        'tDiffuse': { value: null },
        'tNormal': { value: null },
        'tDepth': { value: null },
        'tNoise': { value: null },
        'resolution': { value: new Vector2() },
        'cameraProjectionMatrixInverse': { value: new Matrix4() },
        'lumaPhi': { value: 5. },
        'depthPhi': { value: 5. },
        'normalPhi': { value: 5. },
        'radius': { value: 4. },
        'index': { value: 0 }
      },

      vertexShader: /* glsl */`

        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,

      fragmentShader: /* glsl */`

        varying vec2 vUv;

        uniform sampler2D tDiffuse;
        uniform sampler2D tNormal;
        uniform sampler2D tDepth;
        uniform sampler2D tNoise;
        uniform vec2 resolution;
        uniform mat4 cameraProjectionMatrixInverse;
        uniform float lumaPhi;
        uniform float depthPhi;
        uniform float normalPhi;
        uniform float radius;
        uniform int index;

        #include <common>
        #include <packing>

        #ifndef SAMPLE_LUMINANCE
        #define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
        #endif

        #ifndef FRAGMENT_OUTPUT
        #define FRAGMENT_OUTPUT vec4(denoised, 1.)
        #endif

        float getLuminance(const in vec3 a) {
          return SAMPLE_LUMINANCE;
        }

        const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

        vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
          #ifdef USE_REVERSED_DEPTH_BUFFER
            vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
          #else
            vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
          #endif
          vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
          return viewSpacePosition.xyz / viewSpacePosition.w;
        }

        float getDepth(const vec2 uv) {
          return textureLod(tDepth, uv.xy, 0.0).r;
        }

        float fetchDepth(const ivec2 uv) {
          return texelFetch(tDepth, uv.xy, 0).r;
        }

        vec3 computeNormalFromDepth(const vec2 uv) {
          vec2 size = vec2(textureSize(tDepth, 0));
          ivec2 p = ivec2(uv * size);
          float c0 = fetchDepth(p);
          float l2 = fetchDepth(p - ivec2(2, 0));
          float l1 = fetchDepth(p - ivec2(1, 0));
          float r1 = fetchDepth(p + ivec2(1, 0));
          float r2 = fetchDepth(p + ivec2(2, 0));
          float b2 = fetchDepth(p - ivec2(0, 2));
          float b1 = fetchDepth(p - ivec2(0, 1));
          float t1 = fetchDepth(p + ivec2(0, 1));
          float t2 = fetchDepth(p + ivec2(0, 2));
          float dl = abs((2.0 * l1 - l2) - c0);
          float dr = abs((2.0 * r1 - r2) - c0);
          float db = abs((2.0 * b1 - b2) - c0);
          float dt = abs((2.0 * t1 - t2) - c0);
          vec3 ce = getViewPosition(uv, c0).xyz;
          vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
                      : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
          vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
                      : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
          return normalize(cross(dpdx, dpdy));
        }

        vec3 getViewNormal(const vec2 uv) {
        #if NORMAL_VECTOR_TYPE == 2
          return normalize(textureLod(tNormal, uv, 0.).rgb);
        #elif NORMAL_VECTOR_TYPE == 1
          return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
        #else
          return computeNormalFromDepth(uv);
        #endif
        }

        void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
          vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
          float sampleDepth = getDepth(sampleUv);
          vec3 sampleNormal = getViewNormal(sampleUv);
          vec3 neighborColor = sampleTexel.rgb;
          vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

          float normalDiff = dot(viewNormal, sampleNormal);
          float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
          float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
          float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
          float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
          float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
          float w = lumaSimilarity * depthSimilarity * normalSimilarity;

          denoised += w * neighborColor;
          totalWeight += w;
        }

        void main() {
          float depth = getDepth(vUv.xy);
          vec3 viewNormal = getViewNormal(vUv);
          if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
            discard;
            return;
          }
          vec4 texel = textureLod(tDiffuse, vUv, 0.0);
          vec3 center = texel.rgb;
          vec3 viewPos = getViewPosition(vUv, depth);

          vec2 noiseResolution = vec2(textureSize(tNoise, 0));
          vec2 noiseUv = vUv * resolution / noiseResolution;
          vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
          		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
        		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

          float totalWeight = 1.0;
          vec3 denoised = texel.rgb;
          for (int i = 0; i < SAMPLES; i++) {
            vec3 sampleDir = poissonDisk[i];
            vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
            vec2 sampleUv = vUv + offset;
            denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
          }

          if (totalWeight > 0.) {
            denoised /= totalWeight;
          }
          gl_FragColor = FRAGMENT_OUTPUT;
        }`

    };

    function generatePdSamplePointInitializer( samples, rings, radiusExponent ) {

      const poissonDisk = generateDenoiseSamples(
        samples,
        rings,
        radiusExponent,
      );

      let glslCode = 'vec3[SAMPLES](';

      for ( let i = 0; i < samples; i ++ ) {

        const sample = poissonDisk[ i ];
        glslCode += `vec3(${sample.x}, ${sample.y}, ${sample.z})${( i < samples - 1 ) ? ',' : ')'}`;

      }

      return glslCode;

    }

    function generateDenoiseSamples( numSamples, numRings, radiusExponent ) {

      const samples = [];

      for ( let i = 0; i < numSamples; i ++ ) {

        const angle = 2 * Math.PI * numRings * i / numSamples;
        const radius = Math.pow( i / ( numSamples - 1 ), radiusExponent );
        samples.push( new Vector3( Math.cos( angle ), Math.sin( angle ), radius ) );

      }

      return samples;

    }

    return { GTAOShader, generateMagicSquareNoise, PoissonDenoiseShader, generatePdSamplePointInitializer };
  })();

  // ===== HQ_302: THE LIGHT TOGGLES IN THE REGULAR ENGINE (WebGL) =====
  // The user, 18.11.2026: "יש דרך שאני לא אאבד את היתרונות של WEBGPU כולל האור החוזר?". The WebGPU round's stage 2 had two display
  // toggles, both off by default: soft shadow in corners (ambient occlusion: three.js's GTAO) and light bounced from the walls
  // (screen-space GI). Here are the same two in the regular engine:
  // - Every lit material (standard, physical, lambert) carries, from its first compile, a few lines right after three.js's own
  //   ambient-occlusion step (aomap_fragment). With tmHQOn 0 they do nothing: the same pixels as before. With tmHQOn 1 they read two
  //   screen-sized textures at the pixel: the AO multiplies the INDIRECT light only (the environment map and the hemisphere light, as
  //   three.js's aoMap does and as the WebGPU round's getAO did), so corners, joints and the feet of walls darken while the sunlit faces
  //   keep their light; the GI (rgb) is added to the indirect diffuse light (the WebGPU round's getGI). A toggle compiles nothing in
  //   the materials, so switching it does not stall (in WebGPU every material was rebuilt).
  // - With a toggle on, each frame starts with a prepass at half resolution: depth and view normals of the opaque objects (each
  //   material drawn by a MeshNormalMaterial with its side, clipping planes and polygon offset; transparent, shader, line, point and
  //   label objects are not drawn), then three.js's GTAO (16 samples; radius 1.6 amot, thickness 1.5 - the WebGPU round's values)
  //   and its Poisson denoise, both at half resolution.
  // - hooks.pre(true / false) brackets the prepass (the entry skips the sun's shadow map meanwhile: SHADOW_CACHE_302).
  function HQ_make(renderer, scene, camera, hooks) {
    hooks = hooks || {};
    const L = HQ_LIB;
    const S = { ao: false, gi: false, giWarm: 0, w: 0, h: 0, frames: 0, error: "" };
    const tex1 = (r, g, b) => { const t = new DataTexture(new Uint8Array([r, g, b, 255]), 1, 1); t.needsUpdate = true; return t; };
    const WHITE = tex1(255, 255, 255), BLACK = tex1(0, 0, 0);
    const U = { tmHQOn: { value: 0 }, tmAOTex: { value: WHITE }, tmAOMask: { value: new Vector4(1, 0, 0, 0) }, tmGITex: { value: BLACK }, tmHQInvRes: { value: new Vector2(1, 1) } };
    const DECL = "uniform float tmHQOn;\nuniform sampler2D tmAOTex;\nuniform vec4 tmAOMask;\nuniform sampler2D tmGITex;\nuniform vec2 tmHQInvRes;\n";
    const BLOCK = [
      "if ( tmHQOn > 0.5 ) {",
      "\tvec2 tmUv = gl_FragCoord.xy * tmHQInvRes;",
      "\tfloat tmAO = dot( texture2D( tmAOTex, tmUv ), tmAOMask );",
      "\tvec3 tmGI = texture2D( tmGITex, tmUv ).rgb;",
      "\treflectedLight.indirectDiffuse = reflectedLight.indirectDiffuse * tmAO + tmGI * BRDF_Lambert( material.diffuseColor );",
      "\t#if defined( USE_ENVMAP ) && defined( STANDARD )",
      "\t\tfloat tmNV = saturate( dot( geometryNormal, geometryViewDir ) );",
      "\t\treflectedLight.indirectSpecular *= computeSpecularOcclusion( tmNV, tmAO, material.roughness );",
      "\t#endif",
      "}"
    ].join("\n");
    function patch(shader) {
      for (const k in U) shader.uniforms[k] = U[k];
      if (shader.fragmentShader.indexOf("#include <aomap_fragment>") < 0) return;
      shader.fragmentShader = DECL + shader.fragmentShader.replace("#include <aomap_fragment>", "#include <aomap_fragment>\n" + BLOCK);
    }
    for (const C of [MeshStandardMaterial, MeshPhysicalMaterial, MeshLambertMaterial]) C.prototype.onBeforeCompile = patch;
    // ---- the prepass: each drawn object gets, for its duration, a MeshNormalMaterial of its own material's kind, or none
    const INVIS = new MeshBasicMaterial({ visible: false });
    const NM = new WeakMap(), NA = new WeakMap();
    function nmOf(m) {
      let n = NM.get(m);
      if (!n) {
        n = new MeshNormalMaterial();
        n.blending = NoBlending;
        n.side = m.side;
        n.flatShading = !!m.flatShading;
        n.wireframe = !!m.wireframe;
        NM.set(m, n);
      }
      if (n.side !== m.side) { n.side = m.side; n.needsUpdate = true; }
      n.clippingPlanes = m.clippingPlanes;
      n.clipIntersection = m.clipIntersection;
      n.polygonOffset = m.polygonOffset;
      n.polygonOffsetFactor = m.polygonOffsetFactor;
      n.polygonOffsetUnits = m.polygonOffsetUnits;
      return n;
    }
    const solid = (m) => !!m && m.visible !== false && !m.transparent && m.depthWrite !== false && m.colorWrite !== false &&
      !m.isShaderMaterial && !m.isSpriteMaterial && !m.isPointsMaterial && !m.isLineBasicMaterial;
    const lit = (m) => !!m && m.visible !== false && !m.transparent && !m.isSpriteMaterial && !m.isPointsMaterial && !m.isLineBasicMaterial;
    const SW = [];
    // mode "n": each opaque object drawn by its normal material (the AO / GI prepass); mode "l": drawn as it is, the transparent ones,
    // lines, points and labels left out (the GI's lit prepass, as the WebGPU round's pass.transparent = false)
    function swapIn(o, mode) {
      if (o.visible === false) return;
      if (mode === "l") {
        if (o.isMesh || o.isLine || o.isPoints || o.isSprite) {
          const m = o.material;
          const keep = o.isMesh && (Array.isArray(m) ? m.every(lit) : lit(m));
          if (!keep) { SW.push(o, m); o.material = INVIS; }
        }
        const k = o.children;
        for (let i = 0; i < k.length; i++) swapIn(k[i], mode);
        return;
      }
      if (o.isMesh || o.isLine || o.isPoints || o.isSprite) {
        const m = o.material;
        let r = INVIS;
        if (o.isMesh && !(o.userData && o.userData.noAO)) {
          if (Array.isArray(m)) {
            if (m.every(solid)) {
              let a = NA.get(m);
              if (!a) { a = []; NA.set(m, a); }
              for (let i = 0; i < m.length; i++) a[i] = nmOf(m[i]);
              a.length = m.length;
              r = a;
            }
          } else if (solid(m)) r = nmOf(m);
        }
        SW.push(o, m);
        o.material = r;
      }
      const k = o.children;
      for (let i = 0; i < k.length; i++) swapIn(k[i], mode);
    }
    function swapOut() {
      for (let i = 0; i < SW.length; i += 2) SW[i].material = SW[i + 1];
      SW.length = 0;
    }
    // ---- the targets and the full-screen passes (built on first use)
    let pre = null, aoRT = null, pdRT = null, gtaoM = null, pdM = null, quad = null, qcam = null, litRT = null, giRT = null, giM = null, gdRT = null, gdM = null;
    // the GI's denoise (not in the WebGPU round, whose GI and its AO kept the raw grain of a frame without temporal filtering): 16 taps
    // on a disk of 6 pixels (half resolution), turned per pixel, each weighed by how far it lies from the pixel's own surface plane
    // and how far its normal turns - so the light is smoothed along a surface and never across an edge
    const DEN_FRAG = [
      "varying vec2 vUv;",
      "uniform sampler2D tInput;",
      "uniform highp sampler2D tDepth;",
      "uniform highp sampler2D tNormal;",
      "uniform vec2 resolution;",
      "uniform mat4 cameraProjectionMatrixInverse;",
      "#include <common>",
      "#include <packing>",
      "vec3 tmViewPos( vec2 uv, float depth ) {",
      "\tvec4 v = cameraProjectionMatrixInverse * vec4( vec3( uv, depth ) * 2.0 - 1.0, 1.0 );",
      "\treturn v.xyz / v.w;",
      "}",
      "void main() {",
      "\tfloat d0 = texture2D( tDepth, vUv ).r;",
      "\tvec4 c0 = texture2D( tInput, vUv );",
      "\tif ( d0 >= 1.0 ) { gl_FragColor = c0; return; }",
      "\tvec3 p0 = tmViewPos( vUv, d0 );",
      "\tvec3 n0 = normalize( unpackRGBToNormal( texture2D( tNormal, vUv ).rgb ) );",
      "\tfloat a = rand( gl_FragCoord.xy * 0.01 ) * PI2, ca = cos( a ), sa = sin( a );",
      "\tfloat tol = 0.01 * abs( p0.z ) + 0.03;",
      "\tvec4 sum = c0;",
      "\tfloat wsum = 1.0;",
      "\tfor ( int i = 0; i < 16; i ++ ) {",
      "\t\tfloat fi = float( i );",
      "\t\tfloat r = sqrt( ( fi + 0.5 ) / 16.0 ) * 6.0;",
      "\t\tfloat th = fi * 2.39996323;",
      "\t\tvec2 o = vec2( cos( th ), sin( th ) ) * r;",
      "\t\to = vec2( ca * o.x - sa * o.y, sa * o.x + ca * o.y );",
      "\t\tvec2 uv = vUv + o / resolution;",
      "\t\tfloat d = texture2D( tDepth, uv ).r;",
      "\t\tif ( d >= 1.0 ) continue;",
      "\t\tvec3 p = tmViewPos( uv, d );",
      "\t\tvec3 n = normalize( unpackRGBToNormal( texture2D( tNormal, uv ).rgb ) );",
      "\t\tfloat w = exp( - abs( dot( p - p0, n0 ) ) / tol ) * pow( max( dot( n, n0 ), 0.0 ), 8.0 );",
      "\t\tsum += texture2D( tInput, uv ) * w;",
      "\t\twsum += w;",
      "\t}",
      "\tgl_FragColor = sum / wsum;",
      "}"
    ].join("\n");
    // HQ_302 b: three.js r187's SSGI (examples/jsm/tsl/display/SSGINode.js, MIT; after SSRT3 / SSILVB - screen-space indirect light
    // with a visibility bitmask), written back from TSL into WebGL2 GLSL. The only change of convention: WebGL's texture y points up,
    // so a step along the slice in view space is the same step in uv (the TSL code flips y). Counting bits is done by hand (WebGL2's
    // GLSL ES 3.00 has no bitCount); the depth is read at the pixel (the TSL code gathers four texels - this pass runs at the depth's
    // own resolution). Output: rgb = the bounced light, a = its ambient occlusion.
    const SSGI_FRAG = [
      "varying vec2 vUv;",
      "uniform highp sampler2D tDepth;",
      "uniform highp sampler2D tNormal;",
      "uniform sampler2D tBeauty;",
      "uniform vec2 resolution;",
      "uniform mat4 cameraProjectionMatrixInverse;",
      "#include <common>",
      "#include <packing>",
      "uint tmBits( uint v ) {",
      "\tv = v - ( ( v >> 1u ) & 0x55555555u );",
      "\tv = ( v & 0x33333333u ) + ( ( v >> 2u ) & 0x33333333u );",
      "\treturn ( ( ( v + ( v >> 4u ) ) & 0x0F0F0F0Fu ) * 0x01010101u ) >> 24u;",
      "}",
      "vec3 tmViewPos( vec2 uv, float depth ) {",
      "\tvec4 v = cameraProjectionMatrixInverse * vec4( vec3( uv, depth ) * 2.0 - 1.0, 1.0 );",
      "\treturn v.xyz / v.w;",
      "}",
      "float tmDepth( vec2 uv ) { return texture2D( tDepth, uv ).r; }",
      "vec3 tmNormal( vec2 uv ) { return normalize( unpackRGBToNormal( texture2D( tNormal, uv ).rgb ) ); }",
      "float tmLum( vec3 c ) { return dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ); }",
      "vec2 tmFastAcos( vec2 v ) {",
      "\tvec2 o = abs( v ) * - 0.156583 + PI_HALF;",
      "\to *= sqrt( 1.0 - abs( v ) );",
      "\treturn vec2( v.x >= 0.0 ? o.x : PI - o.x, v.y >= 0.0 ? o.y : PI - o.y );",
      "}",
      "uint tmOcc;",
      "vec3 tmHorizon( bool right, float stepRadius, float radiusVS, vec3 vp, vec2 dirTexel, float initStep, vec3 viewDir, vec3 vn, float n ) {",
      "\tvec2 uvDir = right ? vec2( 1.0 ) : vec2( - 1.0 );",
      "\tfloat sdir = right ? 1.0 : - 1.0;",
      "\tvec3 col = vec3( 0.0 );",
      "\tfor ( int i = 0; i < STEPS; i ++ ) {",
      "\t\tfloat fi = float( i );",
      "\t\tfloat offset = pow( abs( stepRadius * ( fi + initStep ) / radiusVS ), EXP_FACTOR ) * radiusVS;",
      "\t\tvec2 suv = vUv + dirTexel * max( offset, fi + 1.0 ) * uvDir;",
      "\t\tif ( suv.x <= 0.0 || suv.y <= 0.0 || suv.x >= 1.0 || suv.y >= 1.0 ) break;",
      "\t\tvec3 svp = tmViewPos( suv, tmDepth( suv ) );",
      "\t\tvec3 p2s = normalize( svp - vp );",
      "\t\tvec3 p2sb = normalize( svp - viewDir * THICKNESS - vp );",
      "\t\tvec2 fbh = tmFastAcos( clamp( vec2( dot( p2s, viewDir ), dot( p2sb, viewDir ) ), - 1.0, 1.0 ) );",
      "\t\tfbh = clamp( ( sdir * - fbh - ( n - PI_HALF ) ) / PI, 0.0, 1.0 );",
      "\t\tfbh = right ? fbh.yx : fbh.xy;",
      "\t\tuint start = uint( fbh.x * 32.0 ) & 31u;",
      "\t\tuint ang = uint( ceil( ( fbh.y - fbh.x ) * 32.0 ) );",
      "\t\tuint bits = ang > 0u ? ( 0xFFFFFFFFu >> ( 32u - min( ang, 32u ) ) ) : 0u;",
      "\t\tuint cur = ( bits << start ) & ~ tmOcc;",
      "\t\ttmOcc = tmOcc | cur;",
      "\t\tuint zones = tmBits( cur );",
      "\t\tif ( zones > 0u ) {",
      "\t\t\tvec3 lc = texture2D( tBeauty, suv ).rgb;",
      "\t\t\tif ( tmLum( lc ) > 0.001 ) {",
      "\t\t\t\tfloat ndl = clamp( dot( vn, p2s ), 0.0, 1.0 );",
      "\t\t\t\tif ( ndl > 0.001 ) {",
      "\t\t\t\t\tfloat lndl = clamp( dot( tmNormal( suv ), - p2s ), 0.0, 1.0 );",
      "\t\t\t\t\tcol += float( zones ) / 32.0 * lc * ndl * lndl;",
      "\t\t\t\t}",
      "\t\t\t}",
      "\t\t}",
      "\t}",
      "\treturn col;",
      "}",
      "void main() {",
      "\tfloat depth = tmDepth( vUv );",
      "\tif ( depth >= 1.0 ) { gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); return; }",
      "\tvec3 vp = tmViewPos( vUv, depth );",
      "\tvec3 vn = tmNormal( vUv );",
      "\tvec3 viewDir = normalize( - vp );",
      "\tvec2 sc = gl_FragCoord.xy;",
      "\tfloat noiseOffset = 0.25 * float( ( int( sc.y ) - int( sc.x ) ) & 3 );",
      "\tfloat noiseDir = fract( 52.9829189 * fract( dot( sc, vec2( 0.06711056, 0.00583715 ) ) ) );",
      "\tfloat initStep = fract( noiseOffset + 1.0 ) + rand( ( vUv + 0.02 ) * 2.0 - 1.0 );",
      "\tfloat stepRadius = RADIUS * ( resolution.x / 2.0 ) / 16.0 / ( float( STEPS ) + 1.0 );",
      "\tfloat radiusVS = max( 1.0, float( STEPS - 1 ) ) * stepRadius;",
      "\tfloat ao = 0.0;",
      "\tvec3 col = vec3( 0.0 );",
      "\tfor ( int i = 0; i < SLICES; i ++ ) {",
      "\t\tfloat rot = ( float( i ) + noiseDir + 1.0 ) * ( PI / float( SLICES ) );",
      "\t\tvec3 sliceDir = vec3( cos( rot ), sin( rot ), 0.0 );",
      "\t\tvec2 dirTexel = sliceDir.xy / resolution;",
      "\t\tvec3 planeN = normalize( cross( sliceDir, viewDir ) );",
      "\t\tvec3 tangent = cross( viewDir, planeN );",
      "\t\tvec3 projN = vn - planeN * dot( vn, planeN );",
      "\t\tfloat cosn = clamp( dot( normalize( projN ), viewDir ), - 1.0, 1.0 );",
      "\t\tfloat n = - sign( dot( projN, tangent ) ) * acos( cosn );",
      "\t\ttmOcc = 0u;",
      "\t\tcol += tmHorizon( true, stepRadius, radiusVS, vp, dirTexel, initStep, viewDir, vn, n );",
      "\t\tcol += tmHorizon( false, stepRadius, radiusVS, vp, dirTexel, initStep, viewDir, vn, n );",
      "\t\tao += float( tmBits( tmOcc ) ) / 32.0;",
      "\t}",
      "\tao = clamp( pow( clamp( 1.0 - ao / float( SLICES ), 0.0, 1.0 ), AO_INTENSITY ), 0.0, 1.0 );",
      "\tcol = col / float( SLICES ) * GI_INTENSITY;",
      "\tfloat lum = tmLum( col );",
      "\tif ( lum > 7.0 ) col *= 7.0 / lum;",
      "\tgl_FragColor = vec4( col, ao );",
      "}"
    ].join("\n");

    const VS = new Vector2(), CC = new Color();
    function build() {
      const dt = new DepthTexture(4, 4);
      dt.type = UnsignedIntType;
      pre = new WebGLRenderTarget(4, 4, { minFilter: NearestFilter, magFilter: NearestFilter, depthTexture: dt });
      // Full-screen passes only write colour; depth testing/writing are disabled in both materials.
      aoRT = new WebGLRenderTarget(4, 4, { type: HalfFloatType, depthBuffer: false });
      pdRT = new WebGLRenderTarget(4, 4, { type: HalfFloatType, depthBuffer: false });
      const G = L.GTAOShader;
      gtaoM = new ShaderMaterial({ defines: Object.assign({}, G.defines), uniforms: UniformsUtils.clone(G.uniforms), vertexShader: G.vertexShader,
        fragmentShader: G.fragmentShader, blending: NoBlending, depthTest: false, depthWrite: false });
      Object.assign(gtaoM.defines, { PERSPECTIVE_CAMERA: 1, SAMPLES: 16, NORMAL_VECTOR_TYPE: 1, DEPTH_SWIZZLING: "x", SCREEN_SPACE_RADIUS: 0, SCENE_CLIP_BOX: 0 });
      const gu = gtaoM.uniforms;
      gu.tNormal.value = pre.texture;
      gu.tDepth.value = dt;
      gu.tNoise.value = L.generateMagicSquareNoise();
      gu.radius.value = 1.6;          // amot: the reach of the shadow from a corner (the model's unit is the amah) - as in WebGPU
      gu.thickness.value = 1.5;
      gu.distanceFallOff.value = 1;
      gu.scale.value = 1;
      gu.distanceExponent.value = 1;
      const P = L.PoissonDenoiseShader;
      pdM = new ShaderMaterial({ defines: Object.assign({}, P.defines), uniforms: UniformsUtils.clone(P.uniforms), vertexShader: P.vertexShader,
        fragmentShader: P.fragmentShader, blending: NoBlending, depthTest: false, depthWrite: false });
      const pu = pdM.uniforms;
      pu.tDiffuse.value = aoRT.texture;
      pu.tNormal.value = pre.texture;
      pu.tDepth.value = dt;
      // the denoise's rotation noise: three.js draws it from simplex noise; a fixed hash serves the same purpose
      const N = 64, nd = new Uint8Array(N * N * 4);
      for (let i = 0; i < nd.length; i++) { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; nd[i] = Math.floor((x - Math.floor(x)) * 255); }
      const nt = new DataTexture(nd, N, N);
      nt.wrapS = nt.wrapT = RepeatWrapping;
      nt.needsUpdate = true;
      pu.tNoise.value = nt;
      pu.lumaPhi.value = 10;            // GTAOPass's values
      pu.depthPhi.value = 2;
      pu.normalPhi.value = 3;
      pu.radius.value = 8;
      litRT = new WebGLRenderTarget(4, 4, { type: HalfFloatType });
      // AO and GI are mutually exclusive resolve paths: GI returns before the AO passes (its alpha already contains AO).
      // Both paths need the same two half-float colour buffers. Reuse them when switching modes instead of retaining four.
      giRT = aoRT;
      gdRT = pdRT;
      gdM = new ShaderMaterial({ uniforms: { tInput: { value: giRT.texture }, tDepth: { value: dt }, tNormal: { value: pre.texture }, resolution: { value: new Vector2() },
        cameraProjectionMatrixInverse: { value: new Matrix4() } }, vertexShader: G.vertexShader, fragmentShader: DEN_FRAG, blending: NoBlending, depthTest: false, depthWrite: false });
      giM = new ShaderMaterial({
        defines: { SLICES: 2, STEPS: 6, RADIUS: "12.0", EXP_FACTOR: "2.0", THICKNESS: "1.0", AO_INTENSITY: "1.0", GI_INTENSITY: "10.0" },   // the WebGPU round's
        uniforms: { tDepth: { value: dt }, tNormal: { value: pre.texture }, tBeauty: { value: litRT.texture }, resolution: { value: new Vector2() },
          cameraProjectionMatrixInverse: { value: new Matrix4() } },
        vertexShader: G.vertexShader, fragmentShader: SSGI_FRAG, blending: NoBlending, depthTest: false, depthWrite: false });
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
      g.setAttribute("uv", new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));
      quad = new Mesh(g, gtaoM);
      quad.frustumCulled = false;
      qcam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }
    function size() {
      renderer.getDrawingBufferSize(VS);
      U.tmHQInvRes.value.set(1 / Math.max(1, VS.x), 1 / Math.max(1, VS.y));
      const w = Math.max(1, Math.round(VS.x / 2)), h = Math.max(1, Math.round(VS.y / 2));
      if (w === S.w && h === S.h) return;
      S.w = w;
      S.h = h;
      pre.setSize(w, h);
      aoRT.setSize(w, h);
      pdRT.setSize(w, h);
      litRT.setSize(w, h);
      giM.uniforms.resolution.value.set(w, h);
      gdM.uniforms.resolution.value.set(w, h);
      gtaoM.uniforms.resolution.value.set(w, h);
      pdM.uniforms.resolution.value.set(w, h);
    }
    // ---- once a frame, before the canvas is drawn
    function frame() {
      if (!S.ao && !S.gi) { U.tmHQOn.value = 0; return; }
      // GI cannot consume the normal/depth prepass until its lit shaders finish compiling. With AO off, drawing that scene
      // meanwhile is entirely discarded. Keep the same unmodified lighting and start all GI passes on its first ready frame.
      if (!S.ao && S.giWarm !== 2) {
        U.tmGITex.value = BLACK;
        U.tmAOMask.value.set(1, 0, 0, 0);
        U.tmHQOn.value = 0;
        return;
      }
      const rt = renderer.getRenderTarget(), auto = renderer.autoClear, alpha = renderer.getClearAlpha();
      renderer.getClearColor(CC);
      let swapped = false;
      try {
        if (!pre) build();
        size();
        if (hooks.pre) hooks.pre(true);
        swapIn(scene, "n");
        swapped = true;
        const bg = scene.background;
        scene.background = null;
        renderer.autoClear = true;
        renderer.setRenderTarget(pre);
        renderer.setClearColor(0x7777ff, 1);
        renderer.render(scene, camera);
        scene.background = bg;
        swapOut();
        swapped = false;
        if (S.gi && S.giWarm === 2) {
          // the lit prepass (linear light: three.js tone-maps the canvas only), without the toggles' own light (no feedback)
          U.tmHQOn.value = 0;
          swapIn(scene, "l");
          swapped = true;
          renderer.setRenderTarget(litRT);
          renderer.setClearColor(0x000000, 1);
          renderer.render(scene, camera);
          swapOut();
          swapped = false;
        }
        if (hooks.pre) hooks.pre(false);
        if (S.gi && S.giWarm === 2) {
          giM.uniforms.cameraProjectionMatrixInverse.value.copy(camera.projectionMatrixInverse);
          renderer.setClearColor(0x000000, 1);
          quad.material = giM;
          renderer.setRenderTarget(giRT);
          renderer.render(quad, qcam);
          gdM.uniforms.cameraProjectionMatrixInverse.value.copy(camera.projectionMatrixInverse);
          quad.material = gdM;
          renderer.setRenderTarget(gdRT);
          renderer.render(quad, qcam);
          U.tmGITex.value = gdRT.texture;
          // with both on, the GI's own AO is the AO (the WebGPU round's choice: one prepass for both)
          U.tmAOTex.value = S.ao ? gdRT.texture : WHITE;
          U.tmAOMask.value.set(0, 0, 0, 1);
          U.tmHQOn.value = 1;
          S.frames++;
          return;
        }
        U.tmGITex.value = BLACK;
        U.tmAOMask.value.set(1, 0, 0, 0);
        if (!S.ao) { U.tmHQOn.value = 0; return; }
        const gu = gtaoM.uniforms;
        gu.cameraNear.value = camera.near;
        gu.cameraFar.value = camera.far;
        gu.cameraProjectionMatrix.value.copy(camera.projectionMatrix);
        gu.cameraProjectionMatrixInverse.value.copy(camera.projectionMatrixInverse);
        gu.cameraWorldMatrix.value.copy(camera.matrixWorld);
        pdM.uniforms.cameraProjectionMatrixInverse.value.copy(camera.projectionMatrixInverse);
        renderer.setClearColor(0xffffff, 1);
        quad.material = gtaoM;
        renderer.setRenderTarget(aoRT);
        renderer.render(quad, qcam);
        quad.material = pdM;
        renderer.setRenderTarget(pdRT);
        renderer.render(quad, qcam);
        U.tmAOTex.value = S.ao ? pdRT.texture : WHITE;
        U.tmHQOn.value = 1;
        S.frames++;
      } catch (e) {
        if (swapped) swapOut();
        if (hooks.pre) hooks.pre(false);
        S.error = String(e && e.message || e);
        S.ao = S.gi = false;
        U.tmHQOn.value = 0;
        console.warn("[HQ] " + S.error);
      } finally {
        renderer.setRenderTarget(rt);
        renderer.setClearColor(CC, alpha);
        renderer.autoClear = auto;
      }
    }
    // the GI's lit prepass draws every material into a target, where three.js keys its programs apart from the canvas's (no tone
    // mapping, linear output): those programs are compiled in the background (compileAsync) when the toggle is first switched on, and
    // the GI starts once they are ready - a few seconds' wait instead of a stall
    function warmGI() {
      if (S.giWarm) return;
      S.giWarm = 1;
      try {
        if (!pre) build();
        // GI can be omitted from startup when the host does not expose it. Compile
        // its full-screen shaders alongside the lit scene if it is enabled later.
        const effects = new Scene();
        effects.add(new Mesh(quad.geometry, giM), new Mesh(quad.geometry, gdM));
        const rt = renderer.getRenderTarget();
        let p;
        try {
          renderer.setRenderTarget(litRT);
          if (typeof renderer.compileAsync === "function") p = Promise.all([renderer.compileAsync(scene, camera), renderer.compileAsync(effects, qcam)]);
          else { renderer.compile(scene, camera); renderer.compile(effects, qcam); p = Promise.resolve(); }
        } finally { renderer.setRenderTarget(rt); }
        Promise.race([p, new Promise((r) => setTimeout(r, 25e3))]).then(() => { S.giWarm = 2; }, () => { S.giWarm = 2; });
      } catch (e) {
        S.giWarm = 2;
      }
    }
    function set(ao, gi) {
      S.ao = !!ao;
      S.gi = !!gi;
      if (S.gi) warmGI();
      if (!S.ao && !S.gi) { U.tmHQOn.value = 0; U.tmAOTex.value = WHITE; U.tmGITex.value = BLACK; }
    }
    // the prepass and AO programs, ready at the load (none built when a toggle is first switched on): the entry adds this scene to its
    // compileAsync of the load
    function warmScene(includeGI = true) {
      if (!pre) build();
      const s = new Scene(), box = new BoxGeometry(1, 1, 1);
      const sides = [FrontSide, BackSide, DoubleSide];
      for (const sd of sides) { const m = new MeshNormalMaterial(); m.side = sd; m.blending = NoBlending; s.add(new Mesh(box, m)); }
      for (const m of includeGI ? [gtaoM, pdM, giM, gdM] : [gtaoM, pdM]) {
        const q = new Mesh(quad.geometry, m);
        q.frustumCulled = false;
        s.add(q);
      }
      return s;
    }
    // QA: the AO texture drawn on the canvas, grey (the headless checks)
    let showM = null;
    function show(which) {
      if (!pdRT) return;
      if (!showM) showM = new ShaderMaterial({ uniforms: { t: { value: null } }, vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
        fragmentShader: "uniform sampler2D t; uniform float m; varying vec2 vUv; void main() { vec4 c = texture2D(t, vUv); gl_FragColor = vec4(m > 1.5 ? c.rgb : vec3(m > 0.5 ? c.a : c.r), 1.0); }", depthTest: false, depthWrite: false });
      if (!showM.uniforms.m) showM.uniforms.m = { value: 0 };
      showM.uniforms.t.value = which === "gi" || which === "giao" ? gdRT.texture : which === "giraw" ? giRT.texture : pdRT.texture;
      showM.uniforms.m.value = which === "gi" || which === "giraw" ? 2 : which === "giao" ? 1 : 0;
      const rt = renderer.getRenderTarget();
      quad.material = showM;
      renderer.setRenderTarget(null);
      renderer.render(quad, qcam);
      renderer.setRenderTarget(rt);
    }
    return { S, U, frame, set, warmScene, show, mats: () => ({ gtaoM, pdM, giM, gdM }), get on() { return S.ao || S.gi; } };
  }
  //@@slot after-HQ_make-note
