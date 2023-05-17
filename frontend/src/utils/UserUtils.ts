import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { rule } from "postcss";


export async function isLoggedIn(): Promise<boolean> {

    return getUser() != null;
}
export async function getUser(): Promise<any> {
    const cookieStore = cookies();
    const accessToken: RequestCookie | undefined = cookieStore.get('accessToken');
    if(accessToken == null) {
        return null;
    }

    const headers: HeadersInit = new Headers();
    headers.set('Accept', 'application/json');
    headers.set("Authorization", accessToken.value);

    const response: Response = await fetch("/api/user", {
        method: "GET",
        headers: headers
    });
    const json = await response.json();
    if(json.has("error")) {
        return null;
    }
    return json;
}