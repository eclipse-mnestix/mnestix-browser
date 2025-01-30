/**
 * This map is used to set the allowed routes per Role.
 */
const AllowedRoutes = {
    mnestixAdmin: ['/templates', '/settings'],
    mnestixUser: ['/templates'],
};

export default AllowedRoutes;

export enum MnestixRole {
    MnestixGuest = 'guest',
    MnestixAdmin = 'mnestix-admin',
    MnestixUser = 'mnestix-user',
}
