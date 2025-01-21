import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
var YT_REG =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    const jsonData = await req.json(); 
    const data = CreateStreamSchema.parse(jsonData); // Now pass the resolved object to Zod

    const isYturl = data.url.match(YT_REG);
    if (!isYturl) {
      return NextResponse.json(
        { msg: "Hey you have sent wrong url" },
        { status: 411 }
      );
    }

    const extractedId = data.url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnails = res.thumbnail.thumbnails;
    console.log(thumbnails);
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );
    const stream = await prismaClient.stream.create({
      data: {
        userid: data.creatorId,
        url: data.url,
        extracted_id: extractedId,
        title: res.title || "cant find videoo",
        type: "Youtube",
        smallthumbnail:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url ||
              "https://plus.unsplash.com/premium_photo-1661596686441-611034b8077e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXJsfGVufDB8fDB8fHww",
        largethumbnail:
          thumbnails[thumbnails.length - 1].url ||
          "https://plus.unsplash.com/premium_photo-1661596686441-611034b8077e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXJsfGVufDB8fDB8fHww",
      },
    });

    return NextResponse.json({
      ...stream,
      upvote:true
      
    });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ msg: error }, { status: 411 });
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const streams = await prismaClient.stream.findMany({
    where: {
      userid:creatorId??""
    }
  })
  return NextResponse.json({
    streams
  })
}
