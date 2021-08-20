export interface IDrawerObject {}

export interface IDrawable {
  draw?: () => void;
}

export interface AAsteriskData {
    f: number;
    g: number;
    h: number;    
  }
  

export interface ISetupable {
  setup?: () => void;
}

export interface IRenderable extends IDrawable, ISetupable {}

export interface ISize {
    width: number;
    height: number;
}
