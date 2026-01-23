import 'styled-components';
import type { Theme } from '@/styles/Theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
