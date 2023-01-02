export default function Other(props: any) {
    return <div>Other {props.name}</div>
}

export async function getStaticProps() {
    return {
        props: {
            name: "Other Component"
        }
    }
}

