// @vitest-environment jsdom
import React from 'react';
import { expect,it,afterEach } from 'vitest';
import { render,screen,cleanup } from '@testing-library/react';
import { UserDataProvider,useUserData } from '../src/context/UserDataContext';
function Contacts(){const {connectedUsersList}=useUserData();return <pre data-testid="contacts">{JSON.stringify(connectedUsersList)}</pre>;}
afterEach(()=>{cleanup();localStorage.clear();});
it('refreshes Arif’s seeded cached number while preserving other saved contacts',()=>{
  localStorage.setItem('arif_bio_connected_users_list',JSON.stringify([
    {id:'BIO-1001',email:'fivupw005@gmail.com',phone:'+92 309 9062590',name:'Arif Uddin',role:'Saved role'},
    {id:'BIO-9999',email:'another@example.test',phone:'+92 309 9062590',name:'Another user'},
  ]));
  render(<UserDataProvider><Contacts/></UserDataProvider>);
  const users=JSON.parse(screen.getByTestId('contacts').textContent!);
  expect(users[0].phone).toBe('+92 343 3519195');expect(users[0].role).toBe('Saved role');expect(users[1].phone).toBe('+92 309 9062590');
  expect(JSON.parse(localStorage.getItem('arif_bio_connected_users_list')!)[0].phone).toBe('+92 343 3519195');
});
it('preserves a deliberately edited cached admin phone',()=>{
  localStorage.setItem('arif_bio_connected_users_list',JSON.stringify([{id:'BIO-1001',email:'fivupw005@gmail.com',phone:'+92 300 1234567'}]));
  render(<UserDataProvider><Contacts/></UserDataProvider>);
  expect(JSON.parse(screen.getByTestId('contacts').textContent!)[0].phone).toBe('+92 300 1234567');
});
