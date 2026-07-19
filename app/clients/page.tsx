import Link from "next/link";

export default function ClientsPage() {
    return (
        <div>
            <h1>موکلان</h1>
            <Link href="/clients/new">ثبت موکل جدید</Link>
        </div>
    );
}