import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ArchetypeDetailsModalProps = {
    readonly handleClose: () => void;
    readonly open: boolean;
};

export function ArchetypeDetailsDialog(props: ArchetypeDetailsModalProps) {
    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="md" >
            <IconButton
                aria-label="close"
                onClick={props.handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent style={{ padding: '40px' }}>
                <div>
                    <h3>Full</h3>
                    This Submodel Template allows to model a full hierarchy (including sub assets) in a single Submodel.
                    This is useful if Entities representing Co-Managed Entities have to be expressed, as
                    Co-Managed-Entities typically do not have an Asset Administration Shell of their own. In addition,
                    full modeling also allows a version status to be kept centrally.
                </div>
                <div>
                    <h3>OneDown</h3>
                    The One Down archetype is useful for subsystem or component manufactures. For any given Asset in the
                    hierarchy tree, an AAS corresponding to the Asset shall exists. The AAS shall contain a Submodel
                    expressing the one down excerpt view starting with the Asset of the AAS. This type allows the
                    modelling of a consistent stand-alone hierarchy in the engineering-phase of the subsystem. The
                    integration is done by adding the subsystem in a top-level system via the given rules of this
                    Submodel Template, e.g., with the HasPart Relation.
                </div>
                <div>
                    <h3>OneUp</h3>
                    The One Up relationship is suitable for describing the installation location of an asset. This
                    enables the asset to provide information without external asset administration shells (e.g., in
                    offline scenarios). In addition, the installation location can already be determined when the parent
                    asset and its AAS are still in the planning stage.
                </div>
            </DialogContent>
        </Dialog>
    );
}
