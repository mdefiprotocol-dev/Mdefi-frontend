import React from 'react';
import { S4PackageData } from '../types/s4Matrix';
import { S4CircularRadialMatrix } from './S4CircularRadialMatrix';

interface S4MatrixTreeProps {
  packageData: S4PackageData;
}

/**
 * S4MatrixTree exports the S4CircularRadialMatrix to preserve backward compatibility
 * and strictly enforce the 2-level circular concentric matrix layout over legacy pyramid views.
 */
export const S4MatrixTree: React.FC<S4MatrixTreeProps> = ({ packageData }) => {
  return <S4CircularRadialMatrix packageData={packageData} />;
};
