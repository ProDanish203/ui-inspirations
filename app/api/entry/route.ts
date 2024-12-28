import { connectDb } from "@/lib/config/db";
import { Entry } from "@/lib/models/Entry.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDb();
        const {
            title,
            desc,
            img,
            url,
        }: {
            title: string;
            desc: string;
            img?: string;
            url: string;
        } = await req.json();

        if (!title || !desc || !url)
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );

        if (url && !url.match(/^(http|https):\/\//i))
            return NextResponse.json(
                { error: "Invalid URL" },
                { status: 400 }
            );

        if (img && !img.match(/\.(jpeg|jpg|gif|png)$/i)) {
            // upload image
        }

        const entry = await Entry.create({
            title,
            desc,
            img,
            url,
        });

        if (!entry)
            return NextResponse.json(
                { error: "Error adding entry" },
                { status: 500 }
            );


        return NextResponse.json({
            message: "Entry added",
            success: true,
            entry,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectDb();
        const searchParams = req.nextUrl.searchParams
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;

        const skip = (page - 1) * limit;
        const totalDocs = await Entry.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        const entries = await Entry.find()
            .limit(limit)
            .skip(skip);

        if (!entries)
            return NextResponse.json(
                { error: "No entries found" },
                { status: 404 }
            );

        return NextResponse.json({
            message: "Entries fetched successfully",
            success: true,
            data: entries,
            pagination: {
                totalDocs,
                limit,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}