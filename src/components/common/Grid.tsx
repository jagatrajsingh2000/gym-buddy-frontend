import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface GridProps extends BoxProps {
  item?: boolean;
  container?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  spacing?: number;
}

const Grid: React.FC<GridProps> = ({ 
  item, 
  container, 
  xs, 
  sm, 
  md, 
  lg, 
  xl, 
  spacing,
  children,
  sx,
  ...props 
}) => {
  const getGridStyles = () => {
    const styles: any = {};
    
    if (container) {
      styles.display = 'flex';
      styles.flexWrap = 'wrap';
      if (spacing) {
        styles.gap = spacing * 8; // Convert spacing to pixels
      }
    }
    
    if (item) {
      styles.flex = '1 1 auto';
      
      // Handle responsive breakpoints
      if (xs !== undefined) {
        if (xs === true) {
          styles.flexBasis = '100%';
        } else if (typeof xs === 'number') {
          styles.flexBasis = `${(xs / 12) * 100}%`;
        }
      }
      
      if (sm !== undefined && typeof sm === 'number') {
        styles['@media (min-width: 600px)'] = {
          flexBasis: `${(sm / 12) * 100}%`
        };
      }
      
      if (md !== undefined && typeof md === 'number') {
        styles['@media (min-width: 900px)'] = {
          flexBasis: `${(md / 12) * 100}%`
        };
      }
      
      if (lg !== undefined && typeof lg === 'number') {
        styles['@media (min-width: 1200px)'] = {
          flexBasis: `${(lg / 12) * 100}%`
        };
      }
      
      if (xl !== undefined && typeof xl === 'number') {
        styles['@media (min-width: 1536px)'] = {
          flexBasis: `${(xl / 12) * 100}%`
        };
      }
    }
    
    return styles;
  };

  return (
    <Box
      sx={{
        ...getGridStyles(),
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Grid;
