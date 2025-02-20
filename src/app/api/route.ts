import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function main(){
    try{
        // データベースと接続
        await prisma.$connect();
    }catch(err){
        return Error("DB接続失敗");
    }
}


// ポスト全記事取得　API
export const GET = async (req: Request, res: NextResponse) => {
    try{
        await main();

        // posts変数に取得したすべての記事を格納
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc" // 降順指定
            }
        });

        // 取り出したメッセージを返す
        return NextResponse.json({message:"success", posts}, {status:200});
    }catch(err){
        return NextResponse.json({message:"error", err}, {status:500});
    }finally{
        // 接続を止める
        prisma.$disconnect();
    }
};

// 投稿用　API
export const POST = async (req: Request, res: NextResponse) => {
    try{
        // 値の受け取り
        const {name,content} = await req.json();

        await main();

        const post = await prisma.post.create({data: {name, content}});

        // 取り出したメッセージを返す
        return NextResponse.json({message:"success", post}, {status:201});
    }catch(err){
        return NextResponse.json({message:"error", err}, {status:500});
    }finally{
        // 接続を止める
        prisma.$disconnect();
    }
};