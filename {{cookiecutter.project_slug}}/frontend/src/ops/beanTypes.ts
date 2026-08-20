export interface ActuatorBean {
  aliases: string[];
  scope: string;
  type: string;
  resource: string | null;
  dependencies: string[];
}

export interface BeanInfo extends ActuatorBean {
  name: string;
  context: string;
}

export interface ActuatorBeansContext {
  beans: Record<string, ActuatorBean>;
  parentId?: string | null;
}

export interface ActuatorBeansResponse {
  contexts: Record<string, ActuatorBeansContext>;
}
