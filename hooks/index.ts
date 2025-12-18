// Redux hooks
export { useAppDispatch } from './useAppDispatch';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/store/store';
// API hooks
export * from './api/useAuth';
export * from './api/useProfile';
export * from './api/useFeedback';
export * from './api/useSupport';

// Other hooks
export { useIsMobile } from './use-mobile';
export { useToast } from './use-toast';
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;