// โค้ดนี้ขึ้นสีแดงเพราะว่าใช้ await ที่ top-level ของไฟล์โดยที่ไฟล์นี้ไม่ได้เป็น module (ไม่มี import หรือ export ใด ๆ)
// วิธีแก้คือให้ wrap โค้ดนี้ไว้ใน async function หรือเพิ่ม export {} ที่ท้ายไฟล์เพื่อให้ TypeScript มองว่าเป็น module
import { test,expect } from '@playwright/test';
// ตัวอย่างการแก้ไขโดย wrap ใน async function:
async function login(page) {
  await page.goto('https://dev-toursystem.techmaster.in.th/login');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'User Name' }).fill('amares');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Password' }).fill('amares.123');
  await page.waitForTimeout(500);
  await page.getByRole('img', { name: 'eye-invisible' }).locator('svg').click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.waitForTimeout(500);
}

async function VehicleGroupType(page) {
  await page.locator('div').filter({ hasText: /^Vehicle$/ }).locator('span').click();
  await page.waitForTimeout(500);
  await page.getByText('Group Type').click();
  await page.waitForTimeout(500);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('main').getByText('Group Type', { exact: true })).toBeVisible();
  await page.waitForTimeout(500);
};

async function CreateGroupType(page, groupTypeName) {
  await page.getByRole('button', { name: 'Create Group Type' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Enter Group Type Name' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Enter Group Type Name' }).fill(groupTypeName);
  await page.waitForTimeout(500);
  await page.locator('input[name="capacity"]').click();
  await page.waitForTimeout(500);
  await page.locator('input[name="capacity"]').fill('50');
  await page.waitForTimeout(500);
  await page.locator('input[name="capacity"]').press('Tab');
  await page.waitForTimeout(500);
  await page.locator('input[name="guide_staff"]').fill('2');
  await page.waitForTimeout(500);
  await page.locator('input[name="guide_staff"]').press('Tab');
  await page.waitForTimeout(500);
  await page.locator('input[name="recommend"]').fill('48');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Ok' }).click();
  await page.waitForTimeout(500);
}

async function CheckDeleteGroupType(page, groupTypeName) {
  expect(page.getByRole('cell', { name: groupTypeName })).toHaveText(groupTypeName);
  await page.waitForTimeout(500);
  await page.getByRole('row', { name: groupTypeName }).locator('div').nth(3).click();
  await page.waitForTimeout(500);
  await page.getByText('Delete').click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Ok' }).click();
  await page.waitForTimeout(500);
  await expect(page.getByRole('cell', { name: groupTypeName })).not.toBeVisible();
  await page.waitForTimeout(500);
}

async function DelectGrouptypeindex0(page, groupTypeName) {
  await page.getByRole('row', { name: groupTypeName }).locator('div').nth(3).click();
  await page.waitForTimeout(1000);
  await page.getByText('Delete').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Ok' }).click();
  await page.waitForTimeout(1000);
  // ตรวจสอบว่าลบสำเร็จ
  // await expect(page.getByRole('cell', { name: groupTypeName })).toHaveCount(0);
  // await page.waitForTimeout(1000);

}

test('Create and Delete Group Type', async ({ page }) => {
  const uniqueNumber = Math.random(); // หรือจะใช้ Math.random() ก็ได้
  const groupTypeName = `test${uniqueNumber}`;

  await login(page)
  await VehicleGroupType(page)
  await CreateGroupType(page, groupTypeName)
  await CheckDeleteGroupType(page, groupTypeName)
});

test('สร้าง Group Type หลายรอบ', async ({ page }) => {
  const uniqueNumber = Math.random(); // หรือจะใช้ Math.random() ก็ได้
  const groupTypeName = `test${uniqueNumber}`;

  await login(page)
  await VehicleGroupType(page)

  for (let i = 0; i < 3; i++) {
    await CreateGroupType(page, groupTypeName)
    await CheckDeleteGroupType(page, groupTypeName)
  }
});

test('Delete Group Type index 0', async ({ page }) => {
  await login(page)
  await VehicleGroupType(page)
  
  // สร้าง array เก็บชื่อ Group Type ที่สร้าง
  const groupTypeNames: string[] = [];
  
  //สร้าง 3 รอบ
  // for (let i = 0; i < 3; i++) {
    // const uniqueNumber = Date.now() + i; // ใช้ timestamp + index เพื่อให้ชื่อไม่ซ้ำ
    // const groupTypeName = `test${uniqueNumber}`;
  //   groupTypeNames.push(groupTypeName);
    
  //   await CreateGroupType(page, groupTypeName)
  // }

  // ลบ 3 รอบ
  for (let i = 0; i < 15; i++) {
    const groupTypeName = groupTypeNames[i];
    
    await DelectGrouptypeindex0(page, groupTypeName)
  }
});

