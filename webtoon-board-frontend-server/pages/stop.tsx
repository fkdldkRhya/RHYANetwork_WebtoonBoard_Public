import { GetServerSidePropsContext } from "next";

const Stop = () => {
  return "Hello!!";
};

export default Stop;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    if (context.req.headers.authorization == process.env.SERVER_STOP_KEY) {
        process.exit(0);
    }
    
    return {
        props:{},
    };
}