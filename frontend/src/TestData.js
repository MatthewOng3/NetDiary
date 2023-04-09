
export const Collection = [
    {
        user_id: '123129837120', //based on id property of user
        name: 'Leisure',
        collectionId: '1231', //unique id referring to the collection
        
    },
    {
        user_id: '123129837120', 
        name: 'Work',
        collectionId: '1232',
    },
    {
        name: 'Random',
        collectionId: '233',
        categories: [{ 
            collectionId: '1232', //Reference the collection the categories are under
            catId: '1232019283',
            name: 'FIT 2099',   //Name of category
            listEntries: [  //Array of objects for each list entry
                {   
                    entryId: '892732122',
                    name: 'Assignment 1',
                    link: 'Ed forums FIT 2099_ A1'
                },
                {
                    entryId: '82134827',
                    name: 'Assignment 2',
                    link: 'Ed forums FIT 2099_ A2'
                },
            ] 
        }]
    }
]

export const Categories = [
    {
        collectionId: '1232', //Reference the collection the categories are under
        catId: '1232019283',
        name: 'FIT 2099',   //Name of category
        listEntries: [  //Array of objects for each list entry
            {   
                entryId: '892732122',
                name: 'Assignment 1',
                link: 'Ed forums FIT 2099_ A1'
            },
            {
                entryId: '82134827',
                name: 'Assignment 2',
                link: 'Ed forums FIT 2099_ A2'
            },
        ] 
    },
    {
        collectionId: '1232',
        catId: '1232120398',
        name: 'FIT 2004',
        listEntries: [
            {
                entryId: '83210100009',
                name: 'Tutorial 2',
                link: 'Master theorem,'
            }
        ]
    }
    ,
    {
        collectionId:  '1231',
        catId: '123109101',
        name: 'Movie List',
        listEntries: [
            {
                entryId: '73999111112',
                name: 'Harry potter 1',
                link: 'Hurawatch HP 1'
            }
        ] 
    },
]

export const Users=[
    {
        id: '123129837120', //Will be mongo db generated
        email: 'matthew@yahoo.com',
        password: '123456',
         
    },
    {
        id: '328423942289',
        email: 'andrea@gmail.com',
        password: 'bobthebuilder',
    }
]

