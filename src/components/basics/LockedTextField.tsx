import { Lock } from '@mui/icons-material';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';

function _LockedTextField(props: TextFieldProps, ref: ForwardedRef<HTMLDivElement>) {
    return (
        <TextField
            disabled
            ref={ref}
            {...props}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <Lock fontSize="small" style={{ opacity: 0.5 }} />
                        </InputAdornment>
                    ),
                }
            }} />
    );
}

export const LockedTextField = forwardRef(_LockedTextField);
