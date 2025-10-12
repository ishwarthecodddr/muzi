/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

// Define the OmitWithTag type
type OmitWithTag<T, K extends keyof T> = Omit<T, K> & { [key: string]: never };

// Define the RouteHandler type
type RouteHandler = {
  GET?: (req: NextRequest) => Promise<NextResponse>;
  POST?: (req: NextRequest) => Promise<NextResponse>;
  // Add other HTTP methods if needed
};

// Define the ValidRouteHandler type
type ValidRouteHandler = OmitWithTag<RouteHandler, 'GET' | 'POST'>;

// Function to check fields
function checkFields<T>(obj: T): void {
  // Implementation of checkFields
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email || ""
        }
    });
    if (!user) {
        return NextResponse.json({
            msg: "Unauthenticated"
        }, { status: 403 })
    }
    //if user do exist then 
    const streams = await prismaClient.stream.findMany({
        where: {
            userid: user.id
        }, include: {
            _count: {
                select: { upvotes: true }
            }
        }
    });

    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }:{_count:{upvotes:number},[key: string]: any}) => ({
            ...rest,
            upvotes: _count?.upvotes ?? 0
        }))
    });
}

