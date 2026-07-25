type Props = {
    trail: string[];
    title: string;
};

export default function Breadcrumb({ trail, title }: Props) {
    return (
        <div className="mb-6">
            <div className="text-xs text-[#8C8A80] mb-0.5">{trail.join(" / ")}</div>
            <h1 className="text-xl font-bold text-[#262420]">{title}</h1>
        </div>
    );
}