/* eslint-disable @typescript-eslint/no-unused-vars */

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// データベース接続を行う補助関数
async function connectToDatabase() {
    try {
        await prisma.$connect();
    } catch (err) {
        throw new Error("DB接続失敗: " + err);
    }
}

// ポスト全記事取得　API
export async function GET() {
    try {
        await connectToDatabase();  // DB接続

        // posts変数に取得したすべての記事を格納
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc" // 降順指定
            }
        });

        // 取り出したメッセージを返す
        return NextResponse.json({ message: "success", posts }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "error", err }, { status: 500 });
    } finally {
        prisma.$disconnect();
    }
}

// 投稿用　API
export const POST = async (req: Request) => {
    try {
        const { name, content } = await req.json();  // リクエストから値を受け取る

        await connectToDatabase();  // DB接続

        // 新しい投稿を作成
        const post = await prisma.post.create({
            data: { name, content }
        });

        return NextResponse.json({ message: "success", post }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "error", err }, { status: 500 });
    } finally {
        prisma.$disconnect();
    }
};
