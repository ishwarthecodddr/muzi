import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

 const upvoteschema = z.object({
        streamId: z.string()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions) // to get details of the user from backend
    const user = await prismaClient.user.findFirst({
        where: {
            email:session?.user?.email??""
        }
    })
    if (!user) {
        return NextResponse.json({
            msg: "User not found "
        },{status:403})
    }
    try {
        const data = upvoteschema.parse(await req.json());
        await prismaClient.upVote.create({
            data: {
                userId: user.id,
                StreamId:data.streamId
            }
        })
    } catch (error){
        return NextResponse.json({
            msg: "Error while upvoting"+error
        },{status:403})
    }
}