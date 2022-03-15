import { IRouter } from '../../../../src/core/server';
import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';
import { schema } from '@kbn/config-schema';

export function registerSSHRoute(router: IRouter) {
  /*
   * Makes a SSH connection, execute commands and returns the result.
   * If the execution succeeds, the result will be in stdout,
   * If not, the result will be in stderr.
   */

  router.get(
    {
      path: '/api/test/ssh',
      validate: false,
    },
    async (context, request, response) => {
      let sshPromise: NodeSSH;
      let sshExecCommandResponse: SSHExecCommandResponse;
      const ssh = new NodeSSH();

      try {
        sshPromise = await ssh.connect({
          host: 'localhost',
          port: 22,
          username: 'username',
          password: 'password',
        });
      } catch (e) {
        console.error(e);
        return response.notFound({
          body: `Host not found.`,
        });
      }

      try {
        sshExecCommandResponse = await sshPromise.execCommand(`ls`);
      } catch (e) {
        console.error(e);
        return response.forbidden({
          body: `Forbidden`,
        });
      }

      return response.ok({
        body: sshExecCommandResponse,
      });
    }
  );
}