# Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`namespace `[`defective_session_registry`](#namespacedefective__session__registry) | 
`namespace `[`emulator_client`](#namespaceemulator__client) | 
`namespace `[`fail_test_client`](#namespacefail__test__client) | 
`namespace `[`manager_server`](#namespacemanager__server) | 
`namespace `[`session_registry`](#namespacesession__registry) | 
`namespace `[`test_client`](#namespacetest__client) | 
`namespace `[`utils`](#namespaceutils) | 

# namespace `defective_session_registry` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`class `[`defective_session_registry::SessionRegistryManager`](#classdefective__session__registry_1_1_session_registry_manager) | 

# class `defective_session_registry::SessionRegistryManager` 

```
class defective_session_registry::SessionRegistryManager
  : public session_registry.SessionRegistryManager
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public def `[`run_session`](#classdefective__session__registry_1_1_session_registry_manager_1aab56dd15d27d07074ab9156a27be8353)`(self,session_id,final_cycles)` | 
`public def `[`step_session`](#classdefective__session__registry_1_1_session_registry_manager_1adfaff7c40805201a1d65162de8429b3f)`(self,session_id,initial_cycle)` | 

## Members

#### `public def `[`run_session`](#classdefective__session__registry_1_1_session_registry_manager_1aab56dd15d27d07074ab9156a27be8353)`(self,session_id,final_cycles)` 

#### `public def `[`step_session`](#classdefective__session__registry_1_1_session_registry_manager_1adfaff7c40805201a1d65162de8429b3f)`(self,session_id,initial_cycle)` 

# namespace `emulator_client` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`class `[`emulator_client::Client`](#classemulator__client_1_1_client) | 

# class `emulator_client::Client` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`srv_conn_str`](#classemulator__client_1_1_client_1a05c0208c03046ab3b24c30f7c08d90c9) | 
`public def `[`__init__`](#classemulator__client_1_1_client_1a7fca990c69de7b7d1fc2ec96096db002)`(self,connection_string)` | 
`public def `[`get_stub`](#classemulator__client_1_1_client_1adc6a1f6781d9bd5e12d442ae556468e3)`(self)` | 
`public def `[`create_machine`](#classemulator__client_1_1_client_1a808beab1f48d8de355ab06d57a8e353b)`(machine_req)` | 
`public def `[`run_machine`](#classemulator__client_1_1_client_1a480212604bf7a9c8b9f598dcd97cc013)`(limit)` | 
`public def `[`step_machine`](#classemulator__client_1_1_client_1a3ea604cb156bb57fd7c537895617d20a)`()` | 

## Members

#### `public  `[`srv_conn_str`](#classemulator__client_1_1_client_1a05c0208c03046ab3b24c30f7c08d90c9) 

#### `public def `[`__init__`](#classemulator__client_1_1_client_1a7fca990c69de7b7d1fc2ec96096db002)`(self,connection_string)` 

#### `public def `[`get_stub`](#classemulator__client_1_1_client_1adc6a1f6781d9bd5e12d442ae556468e3)`(self)` 

#### `public def `[`create_machine`](#classemulator__client_1_1_client_1a808beab1f48d8de355ab06d57a8e353b)`(machine_req)` 

#### `public def `[`run_machine`](#classemulator__client_1_1_client_1a480212604bf7a9c8b9f598dcd97cc013)`(limit)` 

#### `public def `[`step_machine`](#classemulator__client_1_1_client_1a3ea604cb156bb57fd7c537895617d20a)`()` 

# namespace `fail_test_client` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public def `[`make_new_session_request`](#fail__test__client_8py_1a98029758b734218806afce1ba4ffa66a)`()`            | 
`public def `[`address`](#fail__test__client_8py_1af5f21ed86167064128542a3a33098ca5)`(add)`            | 
`public def `[`port_number`](#fail__test__client_8py_1a8a8f81afcf0498b9ac54c44bcd5bbfef)`(port)`            | 
`public def `[`get_args`](#fail__test__client_8py_1ae1f5d73bbb9dad8044d67226b4a86fcf)`()`            | 
`public def `[`run`](#fail__test__client_8py_1a5a0c639f9fc3709e32dd14a1472e3692)`()`            | 

## Members

#### `public def `[`make_new_session_request`](#fail__test__client_8py_1a98029758b734218806afce1ba4ffa66a)`()` 

#### `public def `[`address`](#fail__test__client_8py_1af5f21ed86167064128542a3a33098ca5)`(add)` 

#### `public def `[`port_number`](#fail__test__client_8py_1a8a8f81afcf0498b9ac54c44bcd5bbfef)`(port)` 

#### `public def `[`get_args`](#fail__test__client_8py_1ae1f5d73bbb9dad8044d67226b4a86fcf)`()` 

#### `public def `[`run`](#fail__test__client_8py_1a5a0c639f9fc3709e32dd14a1472e3692)`()` 

# namespace `manager_server` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public def `[`serve`](#manager__server_8py_1a81badb81d9d61282ed2b8651b2d5228c)`(args)`            | 
`class `[`manager_server::_MachineManagerHigh`](#classmanager__server_1_1___machine_manager_high) | 
`class `[`manager_server::_MachineManagerLow`](#classmanager__server_1_1___machine_manager_low) | 

## Members

#### `public def `[`serve`](#manager__server_8py_1a81badb81d9d61282ed2b8651b2d5228c)`(args)` 

# class `manager_server::_MachineManagerHigh` 

```
class manager_server::_MachineManagerHigh
  : public MachineManagerHighServicer
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`session_registry_manager`](#classmanager__server_1_1___machine_manager_high_1a6b9dc9c3fbcad4737f0d802287eab342) | 
`public def `[`__init__`](#classmanager__server_1_1___machine_manager_high_1ad9e37f16b8766c40c863472355aa3431)`(self,session_registry_manager)` | 
`public def `[`ServerShuttingDown`](#classmanager__server_1_1___machine_manager_high_1aa038c601ff527a545efb41aa2943b2e8)`(self,context)` | 
`public def `[`NewSession`](#classmanager__server_1_1___machine_manager_high_1a3ea998e5b742afbddcf17a361cd42d5d)`(self,request,context)` | 
`public def `[`SessionRun`](#classmanager__server_1_1___machine_manager_high_1a2bb71f76908bb4ab696a423680d9e5f3)`(self,request,context)` | 
`public def `[`SessionStep`](#classmanager__server_1_1___machine_manager_high_1ac2e5ae6e988ad72c02aa0bf290876c9f)`(self,request,context)` | 

## Members

#### `public  `[`session_registry_manager`](#classmanager__server_1_1___machine_manager_high_1a6b9dc9c3fbcad4737f0d802287eab342) 

#### `public def `[`__init__`](#classmanager__server_1_1___machine_manager_high_1ad9e37f16b8766c40c863472355aa3431)`(self,session_registry_manager)` 

#### `public def `[`ServerShuttingDown`](#classmanager__server_1_1___machine_manager_high_1aa038c601ff527a545efb41aa2943b2e8)`(self,context)` 

#### `public def `[`NewSession`](#classmanager__server_1_1___machine_manager_high_1a3ea998e5b742afbddcf17a361cd42d5d)`(self,request,context)` 

#### `public def `[`SessionRun`](#classmanager__server_1_1___machine_manager_high_1a2bb71f76908bb4ab696a423680d9e5f3)`(self,request,context)` 

#### `public def `[`SessionStep`](#classmanager__server_1_1___machine_manager_high_1ac2e5ae6e988ad72c02aa0bf290876c9f)`(self,request,context)` 

# class `manager_server::_MachineManagerLow` 

```
class manager_server::_MachineManagerLow
  : public MachineManagerLowServicer
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`session_registry_manager`](#classmanager__server_1_1___machine_manager_low_1ab9029f9c5528e452890f693d556e63c6) | 
`public def `[`__init__`](#classmanager__server_1_1___machine_manager_low_1aef72a3a22e2ef31beb0ca572ec7dfcc3)`(self,session_registry_manager)` | 
`public def `[`CommunicateAddress`](#classmanager__server_1_1___machine_manager_low_1a061659594ec34d6b109effe68d47883a)`(self,request,context)` | 

## Members

#### `public  `[`session_registry_manager`](#classmanager__server_1_1___machine_manager_low_1ab9029f9c5528e452890f693d556e63c6) 

#### `public def `[`__init__`](#classmanager__server_1_1___machine_manager_low_1aef72a3a22e2ef31beb0ca572ec7dfcc3)`(self,session_registry_manager)` 

#### `public def `[`CommunicateAddress`](#classmanager__server_1_1___machine_manager_low_1a061659594ec34d6b109effe68d47883a)`(self,request,context)` 

# namespace `session_registry` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`class `[`session_registry::AddressException`](#classsession__registry_1_1_address_exception) | 
`class `[`session_registry::CartesiSession`](#classsession__registry_1_1_cartesi_session) | 
`class `[`session_registry::RollbackException`](#classsession__registry_1_1_rollback_exception) | 
`class `[`session_registry::SessionIdException`](#classsession__registry_1_1_session_id_exception) | 
`class `[`session_registry::SessionRegistryManager`](#classsession__registry_1_1_session_registry_manager) | 

# class `session_registry::AddressException` 

```
class session_registry::AddressException
  : public Exception
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `session_registry::CartesiSession` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`id`](#classsession__registry_1_1_cartesi_session_1a794b6beff37f237ed56505518e13cc65) | 
`public  `[`lock`](#classsession__registry_1_1_cartesi_session_1abb63569bb5df903467565d4f512b22df) | 
`public  `[`address`](#classsession__registry_1_1_cartesi_session_1ac33601a7e891191a3b6352527f7c9f0d) | 
`public  `[`address_set_event`](#classsession__registry_1_1_cartesi_session_1ad9d825ab940c6c6c21cdbb5e575e2505) | 
`public  `[`cycle`](#classsession__registry_1_1_cartesi_session_1ab0e6311208d811a338d4f178dee19626) | 
`public  `[`snapshot_cycle`](#classsession__registry_1_1_cartesi_session_1af9322165011769183ab82106af23a9bd) | 
`public  `[`creation_machine_req`](#classsession__registry_1_1_cartesi_session_1a03df700eb9d270ed74b064eb22e25146) | 
`public def `[`__init__`](#classsession__registry_1_1_cartesi_session_1a4681459215e5ddd3f6e080d886e66eb8)`(self,session_id)` | 

## Members

#### `public  `[`id`](#classsession__registry_1_1_cartesi_session_1a794b6beff37f237ed56505518e13cc65) 

#### `public  `[`lock`](#classsession__registry_1_1_cartesi_session_1abb63569bb5df903467565d4f512b22df) 

#### `public  `[`address`](#classsession__registry_1_1_cartesi_session_1ac33601a7e891191a3b6352527f7c9f0d) 

#### `public  `[`address_set_event`](#classsession__registry_1_1_cartesi_session_1ad9d825ab940c6c6c21cdbb5e575e2505) 

#### `public  `[`cycle`](#classsession__registry_1_1_cartesi_session_1ab0e6311208d811a338d4f178dee19626) 

#### `public  `[`snapshot_cycle`](#classsession__registry_1_1_cartesi_session_1af9322165011769183ab82106af23a9bd) 

#### `public  `[`creation_machine_req`](#classsession__registry_1_1_cartesi_session_1a03df700eb9d270ed74b064eb22e25146) 

#### `public def `[`__init__`](#classsession__registry_1_1_cartesi_session_1a4681459215e5ddd3f6e080d886e66eb8)`(self,session_id)` 

# class `session_registry::RollbackException` 

```
class session_registry::RollbackException
  : public Exception
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `session_registry::SessionIdException` 

```
class session_registry::SessionIdException
  : public Exception
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `session_registry::SessionRegistryManager` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`global_lock`](#classsession__registry_1_1_session_registry_manager_1a38b0a5d821f564a23a6c53cd83b51e47) | 
`public  `[`registry`](#classsession__registry_1_1_session_registry_manager_1a56f48fc0c459dc904af28961d5cd0834) | 
`public  `[`shutting_down`](#classsession__registry_1_1_session_registry_manager_1a2d8bb801cce9f72e010bdba6616e051f) | 
`public  `[`manager_address`](#classsession__registry_1_1_session_registry_manager_1a51d3bf59b9f448ee0ed436cd60e08e14) | 
`public def `[`__init__`](#classsession__registry_1_1_session_registry_manager_1ae960764efaf9b1aba3c69ce814fc16bd)`(self,manager_address)` | 
`public def `[`new_session`](#classsession__registry_1_1_session_registry_manager_1aca2794ccb6ac07c8eccfe22e58d4da35)`(self,session_id,machine_req)` | 
`public def `[`run_session`](#classsession__registry_1_1_session_registry_manager_1a2ad394aea9b3c8ed9de03c6727c9a8f2)`(self,session_id,final_cycles)` | 
`public def `[`step_session`](#classsession__registry_1_1_session_registry_manager_1aec7947daafef22c42c8eb0d48a2f7774)`(self,session_id,initial_cycle)` | 
`public def `[`register_session`](#classsession__registry_1_1_session_registry_manager_1aaa5d6913b84c4694344d2434719903b5)`(self,session_id)` | 
`public def `[`wait_for_session_address_communication`](#classsession__registry_1_1_session_registry_manager_1a06c4ce68d963e1f3f1afa49845268fa3)`(self,session_id)` | 
`public def `[`register_address_for_session`](#classsession__registry_1_1_session_registry_manager_1a0c8ca19ded8a3790688f077988ed78b6)`(self,session_id,address)` | 
`public def `[`create_new_cartesi_machine_server`](#classsession__registry_1_1_session_registry_manager_1a5c15c96d8b343fa8d8d27af3b193e224)`(self,session_id)` | 
`public def `[`create_machine`](#classsession__registry_1_1_session_registry_manager_1ae22c116f583418aebc57377af452111e)`(self,session_id,machine_req)` | 
`public def `[`get_machine_root_hash`](#classsession__registry_1_1_session_registry_manager_1a5a500220e36e7e5ed7a0d075562b31ed)`(self,session_id)` | 
`public def `[`snapshot_machine`](#classsession__registry_1_1_session_registry_manager_1aeba0b3d5addbb00c8ae663e911765019)`(self,session_id)` | 
`public def `[`rollback_machine`](#classsession__registry_1_1_session_registry_manager_1a5830f8611b9d6a9a4af98541821b2d42)`(self,session_id)` | 
`public def `[`recreate_machine`](#classsession__registry_1_1_session_registry_manager_1ae59891eff96c91c48f7bc778b2b3a2fe)`(self,session_id)` | 
`public def `[`run_and_update_registry_cycle`](#classsession__registry_1_1_session_registry_manager_1a26eac13f59c7e894ce77ab8cd0e1f0da)`(self,session_id,c)` | 
`public def `[`step_and_update_registry_cycle`](#classsession__registry_1_1_session_registry_manager_1a65b89d36612688d934ed6351aae62327)`(self,session_id)` | 

## Members

#### `public  `[`global_lock`](#classsession__registry_1_1_session_registry_manager_1a38b0a5d821f564a23a6c53cd83b51e47) 

#### `public  `[`registry`](#classsession__registry_1_1_session_registry_manager_1a56f48fc0c459dc904af28961d5cd0834) 

#### `public  `[`shutting_down`](#classsession__registry_1_1_session_registry_manager_1a2d8bb801cce9f72e010bdba6616e051f) 

#### `public  `[`manager_address`](#classsession__registry_1_1_session_registry_manager_1a51d3bf59b9f448ee0ed436cd60e08e14) 

#### `public def `[`__init__`](#classsession__registry_1_1_session_registry_manager_1ae960764efaf9b1aba3c69ce814fc16bd)`(self,manager_address)` 

#### `public def `[`new_session`](#classsession__registry_1_1_session_registry_manager_1aca2794ccb6ac07c8eccfe22e58d4da35)`(self,session_id,machine_req)` 

#### `public def `[`run_session`](#classsession__registry_1_1_session_registry_manager_1a2ad394aea9b3c8ed9de03c6727c9a8f2)`(self,session_id,final_cycles)` 

#### `public def `[`step_session`](#classsession__registry_1_1_session_registry_manager_1aec7947daafef22c42c8eb0d48a2f7774)`(self,session_id,initial_cycle)` 

#### `public def `[`register_session`](#classsession__registry_1_1_session_registry_manager_1aaa5d6913b84c4694344d2434719903b5)`(self,session_id)` 

#### `public def `[`wait_for_session_address_communication`](#classsession__registry_1_1_session_registry_manager_1a06c4ce68d963e1f3f1afa49845268fa3)`(self,session_id)` 

#### `public def `[`register_address_for_session`](#classsession__registry_1_1_session_registry_manager_1a0c8ca19ded8a3790688f077988ed78b6)`(self,session_id,address)` 

#### `public def `[`create_new_cartesi_machine_server`](#classsession__registry_1_1_session_registry_manager_1a5c15c96d8b343fa8d8d27af3b193e224)`(self,session_id)` 

#### `public def `[`create_machine`](#classsession__registry_1_1_session_registry_manager_1ae22c116f583418aebc57377af452111e)`(self,session_id,machine_req)` 

#### `public def `[`get_machine_root_hash`](#classsession__registry_1_1_session_registry_manager_1a5a500220e36e7e5ed7a0d075562b31ed)`(self,session_id)` 

#### `public def `[`snapshot_machine`](#classsession__registry_1_1_session_registry_manager_1aeba0b3d5addbb00c8ae663e911765019)`(self,session_id)` 

#### `public def `[`rollback_machine`](#classsession__registry_1_1_session_registry_manager_1a5830f8611b9d6a9a4af98541821b2d42)`(self,session_id)` 

#### `public def `[`recreate_machine`](#classsession__registry_1_1_session_registry_manager_1ae59891eff96c91c48f7bc778b2b3a2fe)`(self,session_id)` 

#### `public def `[`run_and_update_registry_cycle`](#classsession__registry_1_1_session_registry_manager_1a26eac13f59c7e894ce77ab8cd0e1f0da)`(self,session_id,c)` 

#### `public def `[`step_and_update_registry_cycle`](#classsession__registry_1_1_session_registry_manager_1a65b89d36612688d934ed6351aae62327)`(self,session_id)` 

# namespace `test_client` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public def `[`build_mtdparts_str`](#test__client_8py_1adf1a7efefcd521f96a04f6b6607d5cac)`(drives)`            | 
`public def `[`make_new_session_request`](#test__client_8py_1a7f4970f8044dacfb609810379db8f74d)`()`            | 
`public def `[`make_new_session_run_request`](#test__client_8py_1add73a3f29f5ef276a52a3b3644524432)`(session_id,final_cycles)`            | 
`public def `[`make_new_session_step_request`](#test__client_8py_1a19d8189e72a04a054822cb7ee91ed5a1)`(session_id,initial_cycle)`            | 
`public def `[`dump_step_response_to_json`](#test__client_8py_1aa9baf6c0acabee3a77bfff4bc55cc315)`(access_log)`            | 
`public def `[`dump_run_response_to_json`](#test__client_8py_1a4b4e9da8c0dcc39261b2c57eedda87c5)`(run_resp)`            | 
`public def `[`port_number`](#test__client_8py_1a3c9941d17d9b7b40c119543c3d92c2b4)`(port)`            | 
`public def `[`get_args`](#test__client_8py_1aa7ca991daea4ed6ca47b6af2ea09ee93)`()`            | 
`public def `[`run`](#test__client_8py_1abcc4e740452b48b77d4d6e081f3bd914)`()`            | 

## Members

#### `public def `[`build_mtdparts_str`](#test__client_8py_1adf1a7efefcd521f96a04f6b6607d5cac)`(drives)` 

#### `public def `[`make_new_session_request`](#test__client_8py_1a7f4970f8044dacfb609810379db8f74d)`()` 

#### `public def `[`make_new_session_run_request`](#test__client_8py_1add73a3f29f5ef276a52a3b3644524432)`(session_id,final_cycles)` 

#### `public def `[`make_new_session_step_request`](#test__client_8py_1a19d8189e72a04a054822cb7ee91ed5a1)`(session_id,initial_cycle)` 

#### `public def `[`dump_step_response_to_json`](#test__client_8py_1aa9baf6c0acabee3a77bfff4bc55cc315)`(access_log)` 

#### `public def `[`dump_run_response_to_json`](#test__client_8py_1a4b4e9da8c0dcc39261b2c57eedda87c5)`(run_resp)` 

#### `public def `[`port_number`](#test__client_8py_1a3c9941d17d9b7b40c119543c3d92c2b4)`(port)` 

#### `public def `[`get_args`](#test__client_8py_1aa7ca991daea4ed6ca47b6af2ea09ee93)`()` 

#### `public def `[`run`](#test__client_8py_1abcc4e740452b48b77d4d6e081f3bd914)`()` 

# namespace `utils` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public def `[`get_new_logger`](#utils_8py_1ac927edb52fd799e0ae5dc58f137d07ac)`(name)`            | 
`public def `[`configure_log`](#utils_8py_1a5b4c0cd5d35dd38eb6b54ea2c2516e0d)`(logger)`            | 
`public def `[`new_cartesi_machine_server`](#utils_8py_1a92204adb42fdffb482c638af7ece2287)`(session_id,manager_address)`            | 
`public def `[`new_machine`](#utils_8py_1a789f852f05a0e6fe418a6a3fca53bb96)`(session_id,address,machine_req)`            | 
`public def `[`shutdown_cartesi_machine_server`](#utils_8py_1a1c2dcb4513b77a2eb213f22262f6558f)`(session_id,address)`            | 
`public def `[`get_machine_hash`](#utils_8py_1a91196b4aa4ce27ef764b64b3abcbed21)`(session_id,address)`            | 
`public def `[`create_machine_snapshot`](#utils_8py_1a54b93f730f3b1d7ace93ab5300bd3455)`(session_id,address)`            | 
`public def `[`rollback_machine`](#utils_8py_1ac514f3bf68e6ab598cfeda1ada3da2a0)`(session_id,address)`            | 
`public def `[`run_machine`](#utils_8py_1ae4519f12484220188ec7755d09abf20f)`(session_id,address,c)`            | 
`public def `[`step_machine`](#utils_8py_1a07de58099d8fc553cd106e3255cddfab)`(session_id,address)`            | 
`public def `[`make_session_run_result`](#utils_8py_1aeb04d2862c466030cbb1245bf9d50677)`(summaries,hashes)`            | 
`public def `[`make_session_step_result`](#utils_8py_1a4d3b0c0a5472d1dac1ebdf89f70b6a98)`(access_log)`            | 
`public def `[`validate_cycles`](#utils_8py_1a9548ef485eb511f374116fb41343f99f)`(values)`            | 
`public def `[`dump_step_response_to_json`](#utils_8py_1a63084bb9e401197db41e4819843e18ee)`(access_log)`            | 
`public def `[`dump_step_response_to_file`](#utils_8py_1a64dcdc9e9e0c2dee6a410e19b9b6e4b0)`(access_log,open_dump_file)`            | 
`public def `[`dump_run_response_to_json`](#utils_8py_1ab18730cb6b15a38e03cc0b346c9f6c7f)`(run_resp)`            | 
`public def `[`dump_run_response_to_file`](#utils_8py_1a37bbff3049fa5ad4c53671cc3ed1ee2a)`(run_resp,open_dump_file)`            | 
`class `[`utils::CartesiMachineServerException`](#classutils_1_1_cartesi_machine_server_exception) | 
`class `[`utils::CycleException`](#classutils_1_1_cycle_exception) | 

## Members

#### `public def `[`get_new_logger`](#utils_8py_1ac927edb52fd799e0ae5dc58f137d07ac)`(name)` 

#### `public def `[`configure_log`](#utils_8py_1a5b4c0cd5d35dd38eb6b54ea2c2516e0d)`(logger)` 

#### `public def `[`new_cartesi_machine_server`](#utils_8py_1a92204adb42fdffb482c638af7ece2287)`(session_id,manager_address)` 

#### `public def `[`new_machine`](#utils_8py_1a789f852f05a0e6fe418a6a3fca53bb96)`(session_id,address,machine_req)` 

#### `public def `[`shutdown_cartesi_machine_server`](#utils_8py_1a1c2dcb4513b77a2eb213f22262f6558f)`(session_id,address)` 

#### `public def `[`get_machine_hash`](#utils_8py_1a91196b4aa4ce27ef764b64b3abcbed21)`(session_id,address)` 

#### `public def `[`create_machine_snapshot`](#utils_8py_1a54b93f730f3b1d7ace93ab5300bd3455)`(session_id,address)` 

#### `public def `[`rollback_machine`](#utils_8py_1ac514f3bf68e6ab598cfeda1ada3da2a0)`(session_id,address)` 

#### `public def `[`run_machine`](#utils_8py_1ae4519f12484220188ec7755d09abf20f)`(session_id,address,c)` 

#### `public def `[`step_machine`](#utils_8py_1a07de58099d8fc553cd106e3255cddfab)`(session_id,address)` 

#### `public def `[`make_session_run_result`](#utils_8py_1aeb04d2862c466030cbb1245bf9d50677)`(summaries,hashes)` 

#### `public def `[`make_session_step_result`](#utils_8py_1a4d3b0c0a5472d1dac1ebdf89f70b6a98)`(access_log)` 

#### `public def `[`validate_cycles`](#utils_8py_1a9548ef485eb511f374116fb41343f99f)`(values)` 

#### `public def `[`dump_step_response_to_json`](#utils_8py_1a63084bb9e401197db41e4819843e18ee)`(access_log)` 

#### `public def `[`dump_step_response_to_file`](#utils_8py_1a64dcdc9e9e0c2dee6a410e19b9b6e4b0)`(access_log,open_dump_file)` 

#### `public def `[`dump_run_response_to_json`](#utils_8py_1ab18730cb6b15a38e03cc0b346c9f6c7f)`(run_resp)` 

#### `public def `[`dump_run_response_to_file`](#utils_8py_1a37bbff3049fa5ad4c53671cc3ed1ee2a)`(run_resp,open_dump_file)` 

# class `utils::CartesiMachineServerException` 

```
class utils::CartesiMachineServerException
  : public Exception
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `utils::CycleException` 

```
class utils::CycleException
  : public Exception
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

Generated by [Moxygen](https://sourcey.com/moxygen)