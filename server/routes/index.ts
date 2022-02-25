import { IRouter } from "../../../../src/core/server";
import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/restarting/ssh',
      validate: false,
    },
   async (context, request, response) => {
     let sshPromise: NodeSSH;
     let sshExecCommandResponse: SSHExecCommandResponse;
     const ssh = new NodeSSH();

     try {
       sshPromise = await ssh.connect({
         host: '192.168.87.45',
         port: 22,
         username: 'web-user',
         password: '',
       });
     } catch (e) {
       return response.notFound({
         body: `Can't reach host.`,
       });
     };

     try {
       sshExecCommandResponse = await sshPromise.execCommand(`/opt/tomcat/latest/bin/startup.sh`);
     } catch (e) {
       return response.forbidden({
         body: `Failed to execute command`,
       });
     };
     
     return response.ok({
       body: sshExecCommandResponse,
     });
   }
  );
}