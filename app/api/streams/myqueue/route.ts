/* eslint-disable @typescript-eslint/no-unused-vars */
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(req: NextRequest) {
    const session = await getServerSession();

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
                select: {
                    upvotes: true
                }
            }
        }
    }
    )
    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes:_count.upvotes
        }))
    })

}
