import { Injectable, inject, signal,computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '@environments/environment'

import {  AuthResponse, AuthUser, RegisterUser } from '@modules/auth/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  private apiUrl = `${environment.apiUrl}/api/token/`;
  private profileUrl = `${environment.apiUrl}/api/shoppingcart/profile/`;

  private registerUrl = `${environment.apiUrl}/api/shoppingcart/auth/register/`;

  private readonly accessToken = signal<string | null>(
    localStorage.getItem('access_token')
  )

  public readonly user = signal<AuthUser | null>(
    this.getStoredUser()
  );

  public readonly isLoggedIn = computed(()=> !!this.accessToken())
  public readonly isAdmin = computed(() => this.user()?.group === 'admin');

  public login(username:string, password:string): Observable<AuthUser>{
    return this.http.post<AuthResponse>(this.apiUrl, {username, password}).pipe(
      tap((response: AuthResponse)=>{
        console.log(response)
        this.setAccessToken(response.access)
        this.setUser(response.user);
      }),
      switchMap((response: AuthResponse) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${response.access}`);
        return this.http.get<AuthUser>(this.profileUrl, { headers });
      }),
      tap((userProfile: AuthUser) => {
        console.log('Perfil de usuario obtenido:', userProfile);
        this.setUser(userProfile);
      })
    );
  }

  public register(data: RegisterUser): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(this.registerUrl, data)
  }

  private setAccessToken(token: string): void{
    localStorage.setItem('access_token',token)
    this.accessToken.set(token)
  }

  public getAccessToken(): string | null{
    return localStorage.getItem('access_token')
  }

  private setUser(user: AuthUser): void {
    localStorage.setItem('user', JSON.stringify(user) as string);
    this.user.set(user);
  }

  public logout(): void{
    this.removeAccessToken();
    this.removeUser();
  }

  private removeUser(): void {
  localStorage.removeItem('user');
  this.user.set(null);
  }

  private removeAccessToken(): void{
    localStorage.removeItem('access_token')
    this.accessToken.set(null)

  }

  private getStoredUser():AuthUser | null {

    const user = localStorage.getItem('user');

    return user? JSON.parse(user): null;

  }

  public getUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

}
