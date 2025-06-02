/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/crud_app.json`.
 */
export type CrudApp = {
  "address": "Bfs5UjX5queZULKZbq8PiimwybgtyQ6Zw1TtDLssRWLo",
  "metadata": {
    "name": "crudApp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "journalEntryCreate",
      "discriminator": [
        241,
        121,
        57,
        164,
        20,
        126,
        86,
        115
      ],
      "accounts": [
        {
          "name": "journalEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "journalEntryDelete",
      "discriminator": [
        111,
        196,
        201,
        108,
        226,
        88,
        28,
        218
      ],
      "accounts": [
        {
          "name": "journalEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "journalEntryUpdate",
      "discriminator": [
        92,
        158,
        140,
        90,
        62,
        204,
        147,
        146
      ],
      "accounts": [
        {
          "name": "journalEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "journalEntry",
      "discriminator": [
        255,
        74,
        177,
        178,
        227,
        112,
        46,
        152
      ]
    }
  ],
  "types": [
    {
      "name": "journalEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
