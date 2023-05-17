import { Context } from '@nuxt/types';

export default function ({ $auth, redirect }: Context) {
  if ($auth.loggedIn) {
    return redirect('/');
  }
}
