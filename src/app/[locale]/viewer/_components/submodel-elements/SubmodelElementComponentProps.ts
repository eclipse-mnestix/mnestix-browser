import { SubmodelElementChoice } from 'lib/api/aas/models';


export type SubmodelElementComponentProps = {
    submodelElement?: SubmodelElementChoice,
    submodelId?: string
    hasDivider?: boolean
    key?: string | number | null
}