type AccessPermissions = {
  [key: string]: string;
};

/**
 * #### Customized
 * - 000: refresh:session
 * - 001: reset:password
 * #### Account
 * - 100: create:account
 * - 101: read:account
 * - 102: update:account
 * - 103: delete:account
 * #### Profile
 * - 200: create:profile
 * - 201: read:profile
 * - 202: update:profile
 * - 203: delete:profile
 * #### Tasks
 * - 300: create:task
 * - 301: read:task
 * - 302: update:task
 * - 303: delete:task
 */
export const Permissions: AccessPermissions = {
  // Customized
  '000': 'refresh:session',
  '001': 'reset:password',
  //Account
  '100': 'create:account',
  '101': 'read:account',
  '102': 'update:account',
  '103': 'delete:account',
  // Profile
  '200': 'create:profile',
  '201': 'read:profile',
  '202': 'update:profile',
  '203': 'delete:profile',
  // Tasks
  '300': 'create:task',
  '301': 'read:task',
  '302': 'update:task',
  '303': 'delete:task',
  // Goals
  '400': 'create:goal',
  '401': 'read:goal',
  '402': 'update:goal',
  '403': 'delete:goal',
};

function findManyPermissions(...keys: string[]) {
  const uniquePermissions = new Set<string>();
  keys.forEach(
    (key) => Permissions[key] && uniquePermissions.add(Permissions[key])
  );
  return [...uniquePermissions];
}

export const RoleLevel = {
  Standard: findManyPermissions(
    '101',
    '102',
    '103',
    '201',
    '202',
    '300',
    '301',
    '302',
    '303',
    '400',
    '401',
    '402',
    '403'
  ),
  Anonymous: findManyPermissions('100', '101'),
};
