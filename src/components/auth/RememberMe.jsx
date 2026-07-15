import React from 'react';
import Checkbox from '../ui/Checkbox';

const RememberMe = React.forwardRef(({ ...props }, ref) => {
  return (
    <Checkbox
      ref={ref}
      label="Beni Hatırla"
      {...props}
    />
  );
});

RememberMe.displayName = 'RememberMe';

export default RememberMe;
