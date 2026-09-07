import { prisma } from 'lib/database/prisma';
import { NextRequest } from 'next/server';
import { getAuthError } from 'lib/util/securityHelpers/authGuard';
import { MnestixRole } from 'components/authentication/AllowedRoutes';

export async function GET() {
    const err = await getAuthError([MnestixRole.MnestixAdmin]);
    if (err) return Response.json({ error: err.message }, { status: err.status });

    try {
        const mnestixConnections = await prisma.mnestixConnection.findMany({ include: { types: true } });

        return Response.json(mnestixConnections);
    } catch (error) {
        return Response.json({ error: (error as Error).message });
    }
}

export async function POST(req: NextRequest) {
    const err = await getAuthError([MnestixRole.MnestixAdmin]);
    if (err) return Response.json({ error: err.message }, { status: err.status });

    const mnestixConnectionRequest = await req.json();

    if (!mnestixConnectionRequest.url || !mnestixConnectionRequest.type) {
        return Response.json({ error: 'Url and type are required' });
    }

    try {
        const mnestixType = await prisma.connectionType.findFirst({
            where: { typeName: mnestixConnectionRequest.type },
        });
        if (!mnestixType) {
            return Response.json({ error: 'Invalid type' });
        }
        await prisma.mnestixConnection.create({
            data: {
                url: mnestixConnectionRequest.url,
                infrastructureId: mnestixConnectionRequest.infrastructureId,
                types: { create: [{ typeId: mnestixType.id }] },
            },
        });
        return Response.json({ message: 'MnestixConnection created' });
    } catch (error) {
        return Response.json({ error: (error as Error).message });
    }
}
