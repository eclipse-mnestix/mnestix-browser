import { DataRow } from 'components/basics/DataRow';

export const StyledDataRow = (props: { title: string; children?: React.ReactNode; actions?: React.ReactNode }) => (
    <DataRow title={props.title} hasDivider={false} sx={{ marginBottom: 5 }} actions={props.actions}>
        {props.children}
    </DataRow>
);
