import React from 'react';
import { INPUT_STYLES, ICON_STYLES } from '../../constant/index';

export const FormInput = ({ 
  label, 
  icon: Icon, 
  rightElement,
  ...inputProps 
}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative">
        {Icon && <Icon className={ICON_STYLES} />}
        <input
          className={`${INPUT_STYLES} ${Icon ? 'pl-12' : 'px-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-3`}
          {...inputProps}
        />
        {rightElement && (
          <div className="absolute right-4 top-3.5">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};