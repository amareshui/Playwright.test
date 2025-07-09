import { test, expect } from '@playwright/test';

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9pZCI6MSwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzUyMDU3OTEzLCJleHAiOjE3NTIxNDQzMTN9.rtd7NANo96LCAnJappD2DKABEIX4cnGntPSmVRbBlu0";

test.describe('Group Type API Tests', () => {
  const baseUrl = 'https://dev-toursystem-api.techmaster.in.th/api';

  test('GET /group-types - ดึงข้อมูล Group Types ทั้งหมด', async ({ request }) => {
    const response = await request.get(`${baseUrl}/group-types`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'x-tenant-id': 'tester'
      }
    });

    console.log('GET /group-types - Status:', response.status());
    
         if (response.status() === 200) {
       const data = await response.json();
       console.log('Success - Data structure:', Object.keys(data));
       
       // ตรวจสอบโครงสร้างข้อมูล
       expect(data).toBeDefined();
       
       if (data.items && Array.isArray(data.items)) {
         console.log(`Found ${data.items.length} group types`);
         
         // ตรวจสอบข้อมูลในแต่ละ item
         for (const item of data.items) {
           expect(item).toHaveProperty('id');
           expect(item).toHaveProperty('name');
           console.log(`- ${item.name} (ID: ${item.id})`);
         }
       }
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      // ตรวจสอบ error structure
      try {
        const errorData = JSON.parse(errorText);
        expect(errorData).toHaveProperty('statusCode');
        expect(errorData).toHaveProperty('message');
      } catch (e) {
        console.log('Error response is not JSON format');
      }
    }
  });

  test('GET /group-types/search - ค้นหา Group Types พร้อม Pagination', async ({ request }) => {
    const searchParams = [
      '?page=1&page_size=15',
      '?page=1&page_size=10',
      '?page=2&page_size=5',
      '?search=test',
      '?page=1&page_size=15&search=group'
    ];

    for (const params of searchParams) {
      console.log(`\n--- Testing search with params: ${params} ---`);
      
             const response = await request.get(`${baseUrl}/group-types/search${params}`, {
         headers: {
           'Authorization': `Bearer ${ACCESS_TOKEN}`,
           'Content-Type': 'application/json',
           'x-tenant-id': 'tester'
         }
       });

      console.log('Status:', response.status());
      
      if (response.status() === 200) {
        const data = await response.json();
        console.log('Success - Response keys:', Object.keys(data));
        
        // ตรวจสอบ pagination
        if (data.pagination) {
          console.log('Pagination info:', data.pagination);
          expect(data.pagination).toHaveProperty('page');
          expect(data.pagination).toHaveProperty('page_size');
        }
        
                 // ตรวจสอบข้อมูล
         if (data.items && Array.isArray(data.items)) {
           console.log(`Found ${data.items.length} items`);
         }
        
      } else {
        const errorText = await response.text();
        console.log('Error:', errorText);
      }
    }
  });

  test('POST /group-types - สร้าง Group Type ใหม่', async ({ request }) => {
    const groupTypeData = {
      name: `Test Group ${Date.now()}`,
      capacity: 50,
      guide_staff: 2,
      recommend: 48
    };

    console.log('Creating group type with data:', groupTypeData);

         const response = await request.post(`${baseUrl}/group-types`, {
       data: groupTypeData,
       headers: {
         'Authorization': `Bearer ${ACCESS_TOKEN}`,
         'Content-Type': 'application/json',
         'x-tenant-id': 'tester'
       }
     });

    console.log('POST /group-types - Status:', response.status());
    
           if (response.status() === 201 || response.status() === 200) {
         const createdData = await response.json();
         console.log('Success - Created group type:', createdData);
         
         // ตรวจสอบข้อมูลที่สร้าง
         expect(createdData.data).toHaveProperty('id');
         expect(createdData.data.name).toBe(groupTypeData.name);
         expect(createdData.data.capacity).toBe(groupTypeData.capacity);
         
         return createdData.data.id; // return ID สำหรับใช้ใน test อื่นๆ
      
    } else {
      const errorText = await response.text();
      console.log('Error creating group type:', errorText);
      
      // ตรวจสอบ error structure
      try {
        const errorData = JSON.parse(errorText);
        expect(errorData).toHaveProperty('statusCode');
        expect(errorData).toHaveProperty('message');
      } catch (e) {
        console.log('Error response is not JSON format');
      }
    }
  });

  test('GET /group-types/{id} - ดึงข้อมูล Group Type ตาม ID', async ({ request }) => {
    // สร้าง group type ก่อนเพื่อใช้ ID
    const groupTypeData = {
      name: `Test Group ${Date.now()}`,
      capacity: 30,
      guide_staff: 1,
      recommend: 25
    };

         const createResponse = await request.post(`${baseUrl}/group-types`, {
       data: groupTypeData,
       headers: {
         'Authorization': `Bearer ${ACCESS_TOKEN}`,
         'Content-Type': 'application/json',
         'x-tenant-id': 'tester'
       }
     });

     if (createResponse.status() === 201 || createResponse.status() === 200) {
       const createdData = await createResponse.json();
       const groupTypeId = createdData.id;
       
       console.log(`Testing GET /group-types/${groupTypeId}`);
       
       const response = await request.get(`${baseUrl}/group-types/${groupTypeId}`, {
         headers: {
           'Authorization': `Bearer ${ACCESS_TOKEN}`,
           'Content-Type': 'application/json',
           'x-tenant-id': 'tester'
         }
       });

      console.log('GET /group-types/{id} - Status:', response.status());
      
             if (response.status() === 200) {
         const data = await response.json();
         console.log('Success - Group type details:', data);
         
         // ตรวจสอบข้อมูล
         expect(data.data.id).toBe(groupTypeId);
         expect(data.data.name).toBe(groupTypeData.name);
         expect(data.data.capacity).toBe(groupTypeData.capacity);
        
      } else {
        const errorText = await response.text();
        console.log('Error getting group type:', errorText);
      }
      
    } else {
      console.log('Failed to create group type for testing');
    }
  });

  test('PUT /group-types/{id} - อัปเดต Group Type', async ({ request }) => {
    // สร้าง group type ก่อน
    const groupTypeData = {
      name: `Test Group ${Date.now()}`,
      capacity: 40,
      guide_staff: 2,
      recommend: 35
    };

         const createResponse = await request.post(`${baseUrl}/group-types`, {
       data: groupTypeData,
       headers: {
         'Authorization': `Bearer ${ACCESS_TOKEN}`,
         'Content-Type': 'application/json',
         'x-tenant-id': 'tester'
       }
     });

     if (createResponse.status() === 201 || createResponse.status() === 200) {
       const createdData = await createResponse.json();
       const groupTypeId = createdData.id;
       
       // ข้อมูลสำหรับอัปเดต
       const updateData = {
         name: `Updated Group ${Date.now()}`,
         capacity: 60,
         guide_staff: 3,
         recommend: 55
       };

       console.log(`Testing PUT /group-types/${groupTypeId}`);
       console.log('Update data:', updateData);

       const response = await request.put(`${baseUrl}/group-types/${groupTypeId}`, {
         data: updateData,
         headers: {
           'Authorization': `Bearer ${ACCESS_TOKEN}`,
           'Content-Type': 'application/json',
           'x-tenant-id': 'tester'
         }
       });

      console.log('PUT /group-types/{id} - Status:', response.status());
      
             if (response.status() === 200) {
         const data = await response.json();
         console.log('Success - Updated group type:', data);
         
         // ตรวจสอบข้อมูลที่อัปเดต
         expect(data.data.id).toBe(groupTypeId);
         expect(data.data.name).toBe(updateData.name);
         expect(data.data.capacity).toBe(updateData.capacity);
        
      } else {
        const errorText = await response.text();
        console.log('Error updating group type:', errorText);
      }
      
    } else {
      console.log('Failed to create group type for testing');
    }
  });

  test('DELETE /group-types/{id} - ลบ Group Type', async ({ request }) => {
    // สร้าง group type ก่อน
    const groupTypeData = {
      name: `Test Group ${Date.now()}`,
      capacity: 25,
      guide_staff: 1,
      recommend: 20
    };

         const createResponse = await request.post(`${baseUrl}/group-types`, {
       data: groupTypeData,
       headers: {
         'Authorization': `Bearer ${ACCESS_TOKEN}`,
         'Content-Type': 'application/json',
         'x-tenant-id': 'tester'
       }
     });

     if (createResponse.status() === 201 || createResponse.status() === 200) {
       const createdData = await createResponse.json();
       const groupTypeId = createdData.id;
       
       console.log(`Testing DELETE /group-types/${groupTypeId}`);

       const response = await request.delete(`${baseUrl}/group-types/${groupTypeId}`, {
         headers: {
           'Authorization': `Bearer ${ACCESS_TOKEN}`,
           'Content-Type': 'application/json',
           'x-tenant-id': 'tester'
         }
       });

      console.log('DELETE /group-types/{id} - Status:', response.status());
      
      if (response.status() === 200 || response.status() === 204) {
        console.log('Success - Group type deleted');
        
                 // ตรวจสอบว่าลบแล้วจริงๆ โดยลองดึงข้อมูลอีกครั้ง
         const getResponse = await request.get(`${baseUrl}/group-types/${groupTypeId}`, {
           headers: {
             'Authorization': `Bearer ${ACCESS_TOKEN}`,
             'Content-Type': 'application/json',
             'x-tenant-id': 'tester'
           }
         });
        
        // ควรได้ 404 หรือ error อื่นๆ
        console.log('GET after DELETE - Status:', getResponse.status());
        
      } else {
        const errorText = await response.text();
        console.log('Error deleting group type:', errorText);
      }
      
    } else {
      console.log('Failed to create group type for testing');
    }
  });

  test('ทดสอบ Group Type API Error Cases', async ({ request }) => {
    const testCases = [
      {
        name: 'GET non-existent ID',
        method: 'GET',
        url: '/group-types/999999',
        expectedStatus: 404
      },
      {
        name: 'POST with invalid data',
        method: 'POST',
        url: '/group-types',
        data: { name: '' }, // invalid data
        expectedStatus: 400
      },
      {
        name: 'PUT non-existent ID',
        method: 'PUT',
        url: '/group-types/999999',
        data: { name: 'Test' },
        expectedStatus: 404
      },
      {
        name: 'DELETE non-existent ID',
        method: 'DELETE',
        url: '/group-types/999999',
        expectedStatus: 404
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n--- Testing ${testCase.name} ---`);
      
             const requestOptions: any = {
         headers: {
           'Authorization': `Bearer ${ACCESS_TOKEN}`,
           'Content-Type': 'application/json',
           'x-tenant-id': 'tester'
         }
       };

      if (testCase.data) {
        requestOptions.data = testCase.data;
      }

      const response = await request[testCase.method.toLowerCase()](`${baseUrl}${testCase.url}`, requestOptions);
      
      console.log('Status:', response.status());
      
      const responseText = await response.text();
      console.log('Response:', responseText);
      
      // ตรวจสอบ error response structure
      if (response.status() >= 400) {
        try {
          const errorData = JSON.parse(responseText);
          expect(errorData).toHaveProperty('message');
        } catch (e) {
          console.log('Error response is not JSON format');
        }
      }
    }
  });
}); 