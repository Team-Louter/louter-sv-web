import 'styled-components';
import type { Theme } from '@/styles/Themename';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
