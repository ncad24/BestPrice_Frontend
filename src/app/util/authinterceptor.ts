import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

export const Authinterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  console.log("AQUI ESTOY EN INTERCEPTOR: "+authToken)

  if (authToken) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    console.log(clonedRequest)
    return next(clonedRequest);
  }

  return next(req);
};
