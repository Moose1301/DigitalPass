import { Context } from '@nuxt/types';
import { useAttrs } from 'vue';

export default function ({ $auth, route, redirect }: Context) {

  if (!$auth.loggedIn) {
    return redirect("/login");
  }
  var permission: string = "NONE";
  if (route.meta) {
    permission = String(route.meta.map((meta: any) => {
      if (meta.permission && typeof meta.permission !== 'undefined') {
        return String(meta.permission);
      }
      return "NONE";
    }));
  }
  if (permission == "NONE") {
    return
  }

  if(!(($auth.user!.permissions as any).includes(permission as string))) {
    //TODO Taost of no permision
    return redirect("/profile");
  }
}
