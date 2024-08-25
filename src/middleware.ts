import {withAuth} from 'next-auth/middleware';

export default withAuth({
    pages:{
        //로그인 되지 않았을 떄의 경로
        signIn : '/'
    }
})

export const config = {
    matcher : [
        //로그인한 유저의 경로 접속 권한
        "/conversations/:path*",
        "/user/:path*"
    ]
}