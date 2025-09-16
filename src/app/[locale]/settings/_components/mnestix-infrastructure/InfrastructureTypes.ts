export type InfrastructureFormData = {
    id: string;
    name: string;
    logo?: string;
    securityType: string;
    connections: Array<{
        id: string;
        url: string;
        types: string[];
    }>;
    securityHeader?: {
        name: string;
        value: string;
    };
    securityProxy?: {
        value: string;
    };
};
