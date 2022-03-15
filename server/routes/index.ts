import { IRouter } from '../../../../src/core/server';
import { registerSSHRoute } from './connect_via_ssh';

export function defineRoutes(router: IRouter) {
  registerSSHRoute(router);
}
