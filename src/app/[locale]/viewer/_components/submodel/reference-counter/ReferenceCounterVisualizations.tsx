import { messages } from 'lib/i18n/localization';
import { useIntl } from 'react-intl';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ArrowForward } from '@mui/icons-material';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function ReferenceCounterVisualizations({ submodel }: SubmodelVisualizationProps) {
    const intl = useIntl();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { value } = (submodel.submodelElements?.at(0) as any) ?? [];

    const elementDict = new Map<string, number>();
    const elementNames: string[] = [];
    const elementAASids = new Map<string, string>();

    for (const element of value) {
        const elementAASid: string = element.value.keys.at(0).value;

        if (elementAASid.includes('/aas/')) {
            const elementName = elementAASid.split('/aas/')[1];

            if (element.idShort.includes(elementName)) {
                if (!elementNames.includes(elementName)) {
                    elementNames.push(elementName);
                    elementAASids.set(elementName, elementAASid);
                }

                const newElementCount = (elementDict.get(elementName) ?? 0) + 1;
                elementDict.set(elementName, newElementCount);
            }
        }
    }

    return (
        <div>
            <style>
                {'th,td { min-width: 250px; padding: 12px 15px; }' +
                    'thead tr {background-color: #5e6b7c; color: #ffffff; text-align: center; }' +
                    '.ReferenceCounterTable {' +
                    'border-collapse: collapse;' +
                    'margin: 25px 0;' +
                    'min-width: 400px;' +
                    'box-shadow: 0 0 20px rgba(0, 0, 0, 0.15) }; ' +
                    'tbody tr { border-bottom: 1px solid #dddddd; }' +
                    'tbody tr:nth-of-type(even) { background-color: #f3f3f3; }' +
                    'tbody tr:last-of-type { border-bottom: 2px solid #5e6b7c; }' +
                    'tbody tr:hover { background-color: #DEE2E2;  cursor: pointer; }' +
                    '.elementCount {text-align: center}' +
                    'a { color: rgba(4, 20, 22, 0.87); text-decoration: none; }' +
                    '.arrow-column { min-width: 50px }'}
            </style>
            <table className="ReferenceCounterTable">
                <thead>
                    <tr>
                        <th>{intl.formatMessage(messages.mnestix.referenceCounter.elementName)}</th>
                        <th>{intl.formatMessage(messages.mnestix.referenceCounter.count)}</th>
                        <th className="arrow-column"></th>
                    </tr>
                </thead>
                <tbody>
                    {elementNames.map((elementName) => {
                        return (
                            <tr
                                key={elementName}
                                onClick={() =>
                                    (window.location.href = encodeBase64(elementAASids.get(elementName) ?? ''))
                                }
                            >
                                <td className="elementName">{elementName}</td>
                                <td className="elementCount">{elementDict.get(elementName)}</td>
                                <td className="arrow-column">
                                    <ArrowForward color="primary" />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
