import { Routes } from '@angular/router';

import { Auth } from './modules/auth/auth';
import { ProductListPage } from './modules/productos/pages/product-list-page/product-list-page';

import { AuthService } from '@core/service/auth'
import { authGuard } from '@core/guards/auth-guard';
import { guestGuard } from '@core/guards/guest-guard';
import { adminGuard } from '@core/guards/admi-guard';

export const routes: Routes = [
    {
        path:"login",
        loadComponent: () => import ('./modules/auth/auth').then(m=> m.Auth),
        canActivate:[guestGuard]
    },

    { path: 'productos',
        loadComponent: () => import('./modules/productos/pages/product-list-page/product-list-page').then(m => m.ProductListPage),
        canActivate:[authGuard, adminGuard]
    },

    { path: 'tienda',
        loadComponent: () => import('./modules/tienda/tienda').then(m => m.Tienda),
    },

    { path: 'carrito',
        loadComponent: () => import('./modules/carrito/carrito').then(m => m.Carrito),
    },

    { path: 'mis-pedidos',
        loadComponent: () => import('./modules/pedidos/pedidos').then(m => m.Pedidos),
    },

    
];
