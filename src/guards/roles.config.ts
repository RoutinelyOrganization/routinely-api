type AccessPermissions = {
  [key: string]: string;
};

/**
 * #### Customized
 * - 000: refresh:session
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
 */
export const Permissions: AccessPermissions = {
  // Customized
  '000': 'refresh:session',

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
};

function findManyPermissions(...keys: string[]) {
  const uniquePermissions = new Set<string>();
  keys.forEach(
    (key) => Permissions[key] && uniquePermissions.add(Permissions[key])
  );
  return [...uniquePermissions];
}

export const RoleLevel = {
  Standard: findManyPermissions('101', '102', '103', '201', '202'),
  Anonymous: findManyPermissions('100', '101'),
};
