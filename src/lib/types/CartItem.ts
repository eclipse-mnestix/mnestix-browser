export type CartItem = {
    readonly aasId: string;
    readonly assetId: string;
    readonly productName: string;
    readonly manufacturerName?: string;
    readonly articleNumber?: string;
    readonly pricePerUnit?: number;
    readonly currency?: string;
    quantity: number;
    readonly productImageUrl?: string;
    readonly repositoryUrl?: string;
};
