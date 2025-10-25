const handler = async (req: any, res: any): Promise<any> => {
  // first off, we want to establish a heartbeat listener. This helps us make sure that we
  // continue to product messages. Furthermore, we want to dispatch a message listener
  // so that (given user sets verbose mode on) we can do some of that cool stuff
  // finally, using some form data stuff, we want to continue to send the data
  // to the server and cook up some tunes :)
};

export default handler;
