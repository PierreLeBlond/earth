import fragmentShader from "./shaders/material.fragment.glsl";
import vertexShader from "./shaders/material.vertex.glsl";
import {
  Color,
  type IUniform,
  Matrix4,
  MeshPhysicalMaterial,
  ShaderMaterial,
  TangentSpaceNormalMap,
  Texture,
  UniformsLib,
  UniformsUtils,
  BufferGeometry,
  Camera,
  Group,
  Object3D,
  Scene,
  WebGLRenderer,
} from "three";

export type Ibl = {
  radiance: Texture;
  irradiance: Texture;
  matrix: Matrix4;
};

export type IblSpace = "view" | "world";
export type ToneMapper = "reinhard" | "aces" | "khronos_pbr_neutral";

export type MaterialUniforms = {
  [uniform: string]: IUniform;
  diffuse: { value: Color };
  map: { value: Texture | null };
  normalMap: { value: Texture | null };
  roughness: { value: number };
  roughnessMap: { value: Texture | null };
  metalness: { value: number };
  metalnessMap: { value: Texture | null };
  alphaMap: { value: Texture | null };
  aoMap: { value: Texture | null };
  occlusionFactor: { value: number };
  emissiveMap: { value: Texture | null };
  emissive: { value: Color };
  radiance_map: { value: Texture | null };
  irradiance_map: { value: Texture | null };
  ibl_matrix: { value: Matrix4 };
  brdf_map: { value: Texture | null };
  reflectorMap: { value: Texture | null };
  reflectorDepthMap: { value: Texture | null };
  reflectorMatrix: { value: Matrix4 };
  reflectorProjectionMatrix: { value: Matrix4 };
  reflectorViewMatrix: { value: Matrix4 };
};

export type Defines = {
  [define: string]: string | number;
  OUTPUT_OVERRIDE: string;
};

export class Material extends ShaderMaterial {
  declare public uniforms: MaterialUniforms;
  declare public defines: Defines;

  public get color(): Color {
    return this.uniforms["diffuse"].value;
  }
  public set color(color: Color) {
    this.uniforms["diffuse"].value = color;
  }

  public get map(): Texture | null {
    return this.uniforms["map"].value;
  }
  public set map(map: Texture | null) {
    this.uniforms["map"].value = map;
  }

  public get normalMap(): Texture | null {
    return this.uniforms["normalMap"].value;
  }
  public set normalMap(normalMap: Texture | null) {
    this.uniforms["normalMap"].value = normalMap;
  }
  public normalMapType: number;

  public get roughness(): number {
    return this.uniforms["roughness"].value;
  }
  public set roughness(roughness: number) {
    this.uniforms["roughness"].value = roughness;
  }
  public get roughnessMap(): Texture | null {
    return this.uniforms["roughnessMap"].value;
  }
  public set roughnessMap(roughnessMap: Texture | null) {
    this.uniforms["roughnessMap"].value = roughnessMap;
  }

  public get metalness(): number {
    return this.uniforms["metalness"].value;
  }
  public set metalness(metalness: number) {
    this.uniforms["metalness"].value = metalness;
  }
  public get metalnessMap(): Texture | null {
    return this.uniforms["metalnessMap"].value;
  }
  public set metalnessMap(metalnessMap: Texture | null) {
    this.uniforms["metalnessMap"].value = metalnessMap;
  }

  public get alphaMap(): Texture | null {
    return this.uniforms["alphaMap"].value;
  }
  public set alphaMap(alphaMap: Texture | null) {
    this.uniforms["alphaMap"].value = alphaMap;
  }

  public get aoMap(): Texture | null {
    return this.uniforms["aoMap"].value;
  }
  public set aoMap(aoMap: Texture | null) {
    this.uniforms["aoMap"].value = aoMap;
  }
  public get occlusionFactor(): number {
    return this.uniforms["occlusionFactor"].value;
  }
  public set occlusionFactor(occlusionFactor: number) {
    this.uniforms["occlusionFactor"].value = occlusionFactor;
  }

  public get emissiveMap(): Texture | null {
    return this.uniforms["emissiveMap"].value;
  }
  public set emissiveMap(emissiveMap: Texture | null) {
    this.uniforms["emissiveMap"].value = emissiveMap;
  }
  public get emissive(): Color {
    return this.uniforms["emissive"].value;
  }
  public set emissive(emissive: Color) {
    this.uniforms["emissive"].value = emissive;
  }

  private internalIbl: Ibl | null = null;
  public get ibl(): Ibl | null {
    return this.internalIbl;
  }
  public set ibl(ibl: Ibl | null) {
    this.internalIbl = ibl;
    this.uniforms["radiance_map"].value = ibl?.radiance ?? null;
    this.uniforms["irradiance_map"].value = ibl?.irradiance ?? null;
    this.uniforms["ibl_matrix"].value = ibl?.matrix ?? new Matrix4();
  }

  public iblSpace: IblSpace = "world";
  public toneMapper: ToneMapper = "khronos_pbr_neutral";

  private internalBrdf: Texture | null = null;
  public get brdf(): Texture | null {
    return this.internalBrdf;
  }
  public set brdf(brdf: Texture | null) {
    this.internalBrdf = brdf;
    this.uniforms["brdf_map"].value = brdf;
  }

  public get reflectorMap(): Texture | null {
    return this.uniforms["reflectorMap"].value;
  }
  public set reflectorMap(reflectorMap: Texture | null) {
    this.uniforms["reflectorMap"].value = reflectorMap;
    this.needsUpdate = true;
  }
  public get reflectorDepthMap(): Texture | null {
    return this.uniforms["reflectorDepthMap"].value;
  }
  public set reflectorDepthMap(reflectorDepthMap: Texture | null) {
    this.uniforms["reflectorDepthMap"].value = reflectorDepthMap;
  }
  public get reflectorMatrix(): Matrix4 {
    return this.uniforms["reflectorMatrix"].value;
  }
  public set reflectorMatrix(reflectorMatrix: Matrix4) {
    this.uniforms["reflectorMatrix"].value = reflectorMatrix;
  }
  public get reflectorProjectionMatrix(): Matrix4 {
    return this.uniforms["reflectorProjectionMatrix"].value;
  }
  public set reflectorProjectionMatrix(reflectorProjectionMatrix: Matrix4) {
    this.uniforms["reflectorProjectionMatrix"].value =
      reflectorProjectionMatrix;
  }
  public get reflectorViewMatrix(): Matrix4 {
    return this.uniforms["reflectorViewMatrix"].value;
  }
  public set reflectorViewMatrix(reflectorViewMatrix: Matrix4) {
    this.uniforms["reflectorViewMatrix"].value = reflectorViewMatrix;
  }

  public get ssaoMap(): Texture | null {
    return this.uniforms["ssaoMap"].value;
  }
  public set ssaoMap(ssaoMap: Texture | null) {
    this.uniforms["ssaoMap"].value = ssaoMap;
  }

  public get outputOverride(): string {
    return this.defines["OUTPUT_OVERRIDE"];
  }
  public set outputOverride(value: string) {
    this.defines["OUTPUT_OVERRIDE"] = value;
  }

  public useTriplanarUvMapping: boolean = false;

  public isMeshPhysicalMaterial: boolean;

  public constructor(additionalUniforms: { [uniform: string]: IUniform<any> } = {}) {
    const uniforms: MaterialUniforms = UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.roughnessmap,
      UniformsLib.metalnessmap,
      UniformsLib.normalmap,
      UniformsLib.aomap,
      UniformsLib.emissivemap,
      {
        roughness: { value: 1.0 },
        metalness: { value: 1.0 },
        emissive: { value: new Color(0x000000) },
        radiance_map: { value: null },
        irradiance_map: { value: null },
        ibl_matrix: { value: new Matrix4() },
        brdf_map: { value: null },
        reflectorMap: { value: null },
        reflectorDepthMap: { value: null },
        reflectorMatrix: { value: new Matrix4() },
        reflectorProjectionMatrix: { value: new Matrix4() },
        reflectorViewMatrix: { value: new Matrix4() },
        occlusionFactor: { value: 2.0 },
        ssaoMap: { value: null },
      },
      additionalUniforms
    ]) as MaterialUniforms;

    super({
      name: "material",
      uniforms,
      vertexShader,
      fragmentShader,
    });

    this.isMeshPhysicalMaterial = true;

    this.normalMapType = TangentSpaceNormalMap;
  }

  private setDefine(define: string, condition: boolean, value: string = "") {
    if (condition) {
      this.defines[define] = value;
    } else {
      delete this.defines[define];
    }
  }

  public override onBeforeCompile() {
    this.setDefine("REFLECTOR", !!this.reflectorMap);

    this.setDefine("IBL", !!this.ibl);
    this.setDefine("IBL_IN_VIEW_SPACE", this.iblSpace === "view");

    this.setDefine("USE_TRIPLANAR_UV_MAPPING", this.useTriplanarUvMapping);

    this.setDefine("USE_REINHARD_TONEMAPPER", this.toneMapper === "reinhard");
    this.setDefine("USE_ACES_TONEMAPPER", this.toneMapper === "aces");
    this.setDefine("USE_KHRONOS_PBR_NEUTRAL_TONEMAPPER", this.toneMapper === "khronos_pbr_neutral");

    this.setDefine("USE_SSAO", !!this.ssaoMap);
  }

  public override onBeforeRender(renderer: WebGLRenderer, scene: Scene, camera: Camera, geometry: BufferGeometry, object: Object3D, group: Group): void {
    const sceneIBL = scene.userData["ibl"];
    if (this.ibl == scene.userData["ibl"]) {
      return;
    }
    console.log(sceneIBL);
    this.ibl = sceneIBL;
    this.brdf = scene.userData["brdf"];
    this.needsUpdate = true;
  }

  public override customProgramCacheKey(): string {
    const reflectorCacheKey = this.reflectorMap ? "reflector" : "";
    const iblCacheKey = this.ibl ? "ibl" : "";
    const triplanarUvMapping = this.useTriplanarUvMapping ? "triplanarUvMapping" : "";
    const iblInViewSpaceCacheKey =
      this.iblSpace == "view" ? "iblInViewSpace" : "";
    const ssaoCacheKey = this.ssaoMap ? "ssao" : "";
    return `${reflectorCacheKey}${iblCacheKey}${iblInViewSpaceCacheKey}${triplanarUvMapping}${this.toneMapper}${ssaoCacheKey}`;
  }

  public vampMeshPhysicalMaterial(material: MeshPhysicalMaterial) {
    this.name = material.name;
    this.color.copy(material.color);
    this.map = material.map;
    this.normalMap = material.normalMap;
    this.roughness = material.roughness;
    this.roughnessMap = material.roughnessMap;
    this.metalness = material.metalness;
    this.metalnessMap = material.metalnessMap;
    this.alphaMap = material.alphaMap;
    this.aoMap = material.aoMap;
    this.emissiveMap = material.emissiveMap;
    this.emissive.copy(
      material.emissive.multiplyScalar(material.emissiveIntensity),
    );
  }

  public override copy(source: Material) {

    // Ibl compressedCubeTexture appears to not be clonable, so we remove them temporary then add them as a shallow copy
    const ibl = source.ibl;
    source.ibl = null;

    super.copy(source);

    source.ibl = ibl;
    this.ibl = ibl;

    this.useTriplanarUvMapping = source.useTriplanarUvMapping;

    if (source.outputOverride) {
      this.outputOverride = source.outputOverride;
    }

    this.iblSpace = source.iblSpace;
    this.toneMapper = source.toneMapper;

    return this;

  }
}
