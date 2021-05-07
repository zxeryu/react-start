import { Interpolation } from "@emotion/react";

export interface ThemeObject {}

export type InterpolationWithTheme<Theme> = Interpolation<Theme> | ((theme: Theme) => Interpolation<Theme>);

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DOMAttributes<T> {
    css?: InterpolationWithTheme<ThemeObject>;
  }
}
