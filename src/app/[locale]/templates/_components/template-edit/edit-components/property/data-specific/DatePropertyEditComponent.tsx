import { useState } from 'react';
import { DateValidationError, DesktopDatePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { parse } from 'date-fns';
import { useTranslations } from 'next-intl';

interface DatePropertyEditComponentProps {
    dataValue: string;
    onChange: (dataValue: string) => void;
}

export function DatePropertyEditComponent(props: DatePropertyEditComponentProps) {
    const [data, setData] = useState<string | null>(props.dataValue);
    const [isValid, setIsValid] = useState(true);
    const calenderFormat = 'yyyy-MM-dd';
    const isMobile = useIsMobile();
    const t = useTranslations();

    const onValueChange = (newValue: Date | null) => {
        if (newValue) {
            const val = formatDate(newValue);
            props.onChange(val);
            setData(val);
        } else {
            props.onChange('');
            setData('');
        }
    };

    const onInvalidInput = (reason: DateValidationError) => {
        setIsValid(!reason);
    };

    function formatDate(date: Date) {
        //according to format yyyy-mm-dd
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }

    const startingData = (): Date => {
        if (data) {
            return parse(data, calenderFormat, new Date());
        } else {
            const today = new Date();
            const newDate = formatDate(today);
            props.onChange(newDate);
            setData(newDate);
            return today;
        }
    };

    return (
        <>
            {isMobile ? (
                <MobileDatePicker
                    label={t('common.labels.value')}
                    value={startingData()}
                    onChange={onValueChange}
                    onError={onInvalidInput}
                    slotProps={{
                        textField: {
                            helperText: !isValid && t('validation.errors.invalidDate'),
                        },
                    }}
                />
            ) : (
                <DesktopDatePicker
                    label={t('common.labels.value')}
                    value={startingData()}
                    onChange={onValueChange}
                    onError={onInvalidInput}
                    slotProps={{
                        textField: {
                            helperText: !isValid && t('validation.errors.invalidDate'),
                            fullWidth: true,
                        },
                    }}
                />
            )}
        </>
    );
}
