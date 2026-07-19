import Link from "next/link";

function NewClientPage() {
    return (
        <>
            <h1>ثبت موکل جدید</h1>
            <Link href="/clients">بازگشت به موکلان</Link>
        </>
    );
}

export default NewClientPage;